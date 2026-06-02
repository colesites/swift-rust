use std::sync::atomic::{AtomicBool, Ordering};
use swift_rust_errors::Result;
use tracing_subscriber::{prelude::*, EnvFilter};

static INIT: AtomicBool = AtomicBool::new(false);

pub fn init() -> Result<()> {
    if INIT.swap(true, Ordering::SeqCst) {
        return Ok(());
    }

    let env_filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("info,swift_rust=debug"));

    let fmt_layer = tracing_subscriber::fmt::layer()
        .with_target(true)
        .with_thread_ids(false)
        .with_line_number(false)
        .with_file(false);

    if let Err(e) = tracing_subscriber::registry()
        .with(env_filter)
        .with(fmt_layer)
        .try_init()
    {
        let msg = e.to_string();
        if !msg.contains("already been set") {
            INIT.store(false, Ordering::SeqCst);
            return Err(swift_rust_errors::Error::Unknown(format!(
                "telemetry init: {e}"
            )));
        }
    }
    Ok(())
}

pub fn shutdown() {}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Event {
    pub name: String,
    pub payload: serde_json::Value,
}

pub fn emit(name: impl Into<String>, payload: serde_json::Value) {
    let event = Event {
        name: name.into(),
        payload,
    };
    tracing::debug!(target: "swift_rust.telemetry", event = ?event);
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Mutex;
    use std::sync::OnceLock;

    static TEST_LOCK: OnceLock<Mutex<()>> = OnceLock::new();

    fn lock() -> std::sync::MutexGuard<'static, ()> {
        TEST_LOCK.get_or_init(|| Mutex::new(())).lock().unwrap()
    }

    #[test]
    fn init_is_idempotent() {
        let _g = lock();
        assert!(init().is_ok());
        assert!(init().is_ok());
        assert!(init().is_ok());
    }

    #[test]
    fn emit_does_not_panic() {
        let _g = lock();
        let _ = init();
        emit("test_event", serde_json::json!({"key": "value"}));
    }
}
