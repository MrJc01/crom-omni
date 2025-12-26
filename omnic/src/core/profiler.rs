//! Build Profiler - Performance Analysis
//!
//! Tracks and reports build performance metrics.

use std::collections::HashMap;
use std::time::{Duration, Instant};
use serde::{Deserialize, Serialize};
use colored::*;

/// Profile event type
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ProfileEvent {
    Parse,
    Lex,
    TypeCheck,
    Optimize,
    CodeGen,
    Write,
    Total,
    Custom(String),
}

impl ProfileEvent {
    pub fn name(&self) -> String {
        match self {
            ProfileEvent::Parse => "Parse".to_string(),
            ProfileEvent::Lex => "Lex".to_string(),
            ProfileEvent::TypeCheck => "Type Check".to_string(),
            ProfileEvent::Optimize => "Optimize".to_string(),
            ProfileEvent::CodeGen => "Code Gen".to_string(),
            ProfileEvent::Write => "Write".to_string(),
            ProfileEvent::Total => "Total".to_string(),
            ProfileEvent::Custom(n) => n.clone(),
        }
    }
}

/// Profile timing entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProfileTiming {
    pub event: ProfileEvent,
    pub duration: Duration,
    pub file: Option<String>,
}

/// Active timer
struct ActiveTimer {
    event: ProfileEvent,
    start: Instant,
    file: Option<String>,
}

/// Build profiler
pub struct Profiler {
    timings: Vec<ProfileTiming>,
    active_timers: HashMap<String, ActiveTimer>,
    total_start: Option<Instant>,
    enabled: bool,
}

impl Profiler {
    pub fn new() -> Self {
        Self {
            timings: Vec::new(),
            active_timers: HashMap::new(),
            total_start: None,
            enabled: true,
        }
    }

    /// Create disabled profiler
    pub fn disabled() -> Self {
        Self {
            timings: Vec::new(),
            active_timers: HashMap::new(),
            total_start: None,
            enabled: false,
        }
    }

    /// Start total timing
    pub fn start_total(&mut self) {
        if self.enabled {
            self.total_start = Some(Instant::now());
        }
    }

    /// Start timing an event
    pub fn start(&mut self, event: ProfileEvent) {
        self.start_with_file(event, None);
    }

    /// Start timing an event with file context
    pub fn start_with_file(&mut self, event: ProfileEvent, file: Option<String>) {
        if !self.enabled {
            return;
        }
        
        let key = format!("{:?}-{}", event, file.as_deref().unwrap_or(""));
        self.active_timers.insert(key, ActiveTimer {
            event,
            start: Instant::now(),
            file,
        });
    }

    /// Stop timing an event
    pub fn stop(&mut self, event: ProfileEvent) {
        self.stop_with_file(event, None);
    }

    /// Stop timing an event with file context
    pub fn stop_with_file(&mut self, event: ProfileEvent, file: Option<String>) {
        if !self.enabled {
            return;
        }
        
        let key = format!("{:?}-{}", event, file.as_deref().unwrap_or(""));
        if let Some(timer) = self.active_timers.remove(&key) {
            self.timings.push(ProfileTiming {
                event: timer.event,
                duration: timer.start.elapsed(),
                file: timer.file,
            });
        }
    }

    /// Record a timing directly
    pub fn record(&mut self, event: ProfileEvent, duration: Duration) {
        if self.enabled {
            self.timings.push(ProfileTiming {
                event,
                duration,
                file: None,
            });
        }
    }

    /// Time a closure
    pub fn time<F, T>(&mut self, event: ProfileEvent, f: F) -> T
    where
        F: FnOnce() -> T,
    {
        if !self.enabled {
            return f();
        }
        
        let start = Instant::now();
        let result = f();
        self.record(event, start.elapsed());
        result
    }

    /// Get total duration
    pub fn total_duration(&self) -> Duration {
        self.total_start.map(|s| s.elapsed()).unwrap_or_default()
    }

    /// Get timings by event
    pub fn by_event(&self) -> HashMap<ProfileEvent, Duration> {
        let mut result = HashMap::new();
        for timing in &self.timings {
            *result.entry(timing.event.clone()).or_insert(Duration::ZERO) += timing.duration;
        }
        result
    }

    /// Get slowest files
    pub fn slowest_files(&self, limit: usize) -> Vec<(String, Duration)> {
        let mut file_times: HashMap<String, Duration> = HashMap::new();
        
        for timing in &self.timings {
            if let Some(ref file) = timing.file {
                *file_times.entry(file.clone()).or_insert(Duration::ZERO) += timing.duration;
            }
        }
        
        let mut sorted: Vec<_> = file_times.into_iter().collect();
        sorted.sort_by(|a, b| b.1.cmp(&a.1));
        sorted.truncate(limit);
        sorted
    }

    /// Display report
    pub fn display_report(&self) {
        if !self.enabled {
            return;
        }

        println!();
        println!("{}", "⏱ Build Profile".cyan().bold());
        println!();

        let by_event = self.by_event();
        let total = self.total_duration();
        
        let mut events: Vec<_> = by_event.iter().collect();
        events.sort_by(|a, b| b.1.cmp(a.1));

        for (event, duration) in events {
            let pct = if total.as_millis() > 0 {
                (duration.as_millis() as f64 / total.as_millis() as f64) * 100.0
            } else {
                0.0
            };
            
            let bar_width = (pct / 5.0) as usize;
            let bar = "█".repeat(bar_width);
            
            println!("  {:12} {:>8.2}ms {:>5.1}% {}", 
                event.name(),
                duration.as_secs_f64() * 1000.0,
                pct,
                bar.green()
            );
        }

        println!();
        println!("  {} {:>8.2}ms", 
            "Total:".bold(),
            total.as_secs_f64() * 1000.0
        );

        // Slowest files
        let slowest = self.slowest_files(5);
        if !slowest.is_empty() {
            println!();
            println!("{}", "Slowest Files:".yellow());
            for (file, duration) in slowest {
                println!("  {:>8.2}ms  {}", 
                    duration.as_secs_f64() * 1000.0,
                    file
                );
            }
        }
    }

    /// Get JSON report
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self.timings).unwrap_or_default()
    }
}

impl Default for Profiler {
    fn default() -> Self {
        Self::new()
    }
}

/// Global profiler instance (for simple usage)
static mut GLOBAL_PROFILER: Option<Profiler> = None;

/// Initialize global profiler
pub fn init_profiler(enabled: bool) {
    unsafe {
        GLOBAL_PROFILER = Some(if enabled {
            Profiler::new()
        } else {
            Profiler::disabled()
        });
    }
}

/// Get global profiler
pub fn profiler() -> &'static mut Profiler {
    unsafe {
        GLOBAL_PROFILER.get_or_insert_with(Profiler::new)
    }
}
