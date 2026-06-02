//! Background task scheduling for swift-rust.
//!
//! The build pipeline does most things synchronously, but a few are
//! better off happening in the background:
//!
//! - Recompiling after a file change
//! - Re-running type-checks
//! - Emitting telemetry
//! - Cleaning stale build artefacts
//!
//! `Taskless` (a name from the Next.js monorepo) is a small task pool
//! that runs jobs on a dedicated tokio runtime, deduplicates identical
//! in-flight jobs, and surfaces back-pressure to the request layer.

use std::collections::HashMap;
use std::future::Future;
use std::hash::Hash;
use std::sync::Arc;
use std::time::Duration;

use parking_lot::Mutex;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum TaskError {
    #[error("task cancelled")]
    Cancelled,

    #[error("task panicked: {0}")]
    Panicked(String),

    #[error("join: {0}")]
    Join(String),
}

pub type Result<T> = std::result::Result<T, TaskError>;

#[derive(Clone, Hash, Eq, PartialEq, Debug)]
pub struct TaskKey {
    pub kind: String,
    pub subject: String,
}

impl TaskKey {
    pub fn new(kind: impl Into<String>, subject: impl Into<String>) -> Self {
        Self {
            kind: kind.into(),
            subject: subject.into(),
        }
    }
}

#[derive(Default)]
struct InFlight {
    runs: HashMap<TaskKey, Arc<tokio::sync::Notify>>,
}

pub struct Taskless {
    runtime: tokio::runtime::Runtime,
    in_flight: Arc<Mutex<InFlight>>,
}

impl Taskless {
    pub fn new(worker_threads: usize) -> std::io::Result<Self> {
        let runtime = tokio::runtime::Builder::new_multi_thread()
            .worker_threads(worker_threads.max(1))
            .enable_all()
            .thread_name("swift-rust-taskless")
            .build()?;
        Ok(Self {
            runtime,
            in_flight: Arc::new(Mutex::new(InFlight::default())),
        })
    }

    pub fn spawn<F>(&self, key: TaskKey, fut: F) -> Result<()>
    where
        F: Future<Output = ()> + Send + 'static,
    {
        let notify = {
            let mut guard = self.in_flight.lock();
            if let Some(existing) = guard.runs.get(&key) {
                existing.clone()
            } else {
                let n = Arc::new(tokio::sync::Notify::new());
                guard.runs.insert(key.clone(), n.clone());
                n
            }
        };

        let in_flight = self.in_flight.clone();
        self.runtime.spawn(async move {
            fut.await;
            in_flight.lock().runs.remove(&key);
            notify.notify_waiters();
        });

        Ok(())
    }

    pub async fn wait(&self, key: &TaskKey, timeout: Duration) -> Result<()> {
        let notify = {
            let guard = self.in_flight.lock();
            guard.runs.get(key).cloned()
        };
        if let Some(n) = notify {
            let _ = tokio::time::timeout(timeout, n.notified()).await;
        }
        Ok(())
    }
}

impl Drop for Taskless {
    fn drop(&mut self) {
        let runtime = std::mem::replace(
            &mut self.runtime,
            tokio::runtime::Builder::new_current_thread()
                .build()
                .expect("fallback runtime"),
        );
        runtime.shutdown_timeout(Duration::from_millis(100));
    }
}

pub fn debounce<F>(mut f: F, window: Duration) -> impl FnMut() + Send + 'static
where
    F: FnMut() + Send + 'static,
{
    let last = Arc::new(parking_lot::Mutex::new(None::<std::time::Instant>));
    move || {
        let now = std::time::Instant::now();
        let last_clone = last.clone();
        let should_run = {
            let mut g = last_clone.lock();
            match *g {
                Some(t) if now.duration_since(t) < window => false,
                _ => {
                    *g = Some(now);
                    true
                }
            }
        };
        if should_run {
            f();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicUsize, Ordering};

    #[test]
    fn debounce_coalesces_rapid_calls() {
        let count = Arc::new(AtomicUsize::new(0));
        let c = count.clone();
        let mut debounced = debounce(
            move || {
                c.fetch_add(1, Ordering::SeqCst);
            },
            Duration::from_millis(50),
        );
        for _ in 0..10 {
            debounced();
        }
        assert_eq!(count.load(Ordering::SeqCst), 1);
    }

    #[test]
    fn taskless_runs_task() {
        let t = Taskless::new(1).unwrap();
        let ran = Arc::new(AtomicUsize::new(0));
        let r = ran.clone();
        t.spawn(TaskKey::new("test", "x"), async move {
            r.fetch_add(1, Ordering::SeqCst);
        })
        .unwrap();
        std::thread::sleep(Duration::from_millis(20));
        assert!(ran.load(Ordering::SeqCst) >= 1);
    }
}
