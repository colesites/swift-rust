//! Per-stage build profiler.
//!
//! Each `Srspack::build` call records how long it spent in each named
//! stage (walk, read, hash, transform, bundle, record_assets, compress,
//! emit, total). The collector is opt-in: a `Profile` handle is passed
//! into `build_with_profile`; a normal `build` does not allocate one.
//!
//! Output is a fixed-width table; the bench harness can pipe it to
//! `bench/results.md` or a CSV for trending.

use std::time::{Duration, Instant};

#[derive(Debug, Clone, Copy)]
pub struct Stage {
    pub name: &'static str,
    pub elapsed: Duration,
    pub bytes_in: u64,
    pub bytes_out: u64,
}

impl Stage {
    pub fn new(name: &'static str) -> Self {
        Self {
            name,
            elapsed: Duration::ZERO,
            bytes_in: 0,
            bytes_out: 0,
        }
    }
}

#[derive(Debug, Default)]
pub struct Profile {
    pub stages: Vec<Stage>,
    started: Option<Instant>,
    current: Option<(usize, Instant)>,
}

impl Profile {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn start(&mut self) {
        self.started = Some(Instant::now());
    }

    pub fn begin(&mut self, name: &'static str) {
        if self.current.is_none() {
            let idx = self.stages.len();
            self.stages.push(Stage::new(name));
            self.current = Some((idx, Instant::now()));
        }
    }

    pub fn end(&mut self) {
        if let Some((idx, start)) = self.current.take() {
            self.stages[idx].elapsed += start.elapsed();
        }
    }

    pub fn record_bytes_in(&mut self, n: u64) {
        if let Some((idx, _)) = self.current {
            self.stages[idx].bytes_in += n;
        }
    }

    pub fn record_bytes_out(&mut self, n: u64) {
        if let Some((idx, _)) = self.current {
            self.stages[idx].bytes_out += n;
        }
    }

    pub fn total(&self) -> Duration {
        self.started
            .map(|s| s.elapsed())
            .unwrap_or_else(|| self.stages.iter().map(|s| s.elapsed).sum())
    }

    pub fn render(&self) -> String {
        let mut out = String::new();
        out.push_str("stage            time (ms)  bytes in   bytes out\n");
        out.push_str("---------------  ---------  ---------  ----------\n");
        for s in &self.stages {
            out.push_str(&format!(
                "{:<15}  {:>9.2}  {:>9}  {:>10}\n",
                s.name,
                s.elapsed.as_secs_f64() * 1000.0,
                s.bytes_in,
                s.bytes_out,
            ));
        }
        out.push_str("---------------  ---------  ---------  ----------\n");
        let total = self.total();
        out.push_str(&format!(
            "{:<15}  {:>9.2}\n",
            "total",
            total.as_secs_f64() * 1000.0,
        ));
        out
    }
}
