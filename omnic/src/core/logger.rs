//! Log Observability - Unified Logging System
//!
//! Centralized logging for the Omni compiler with structured output,
//! log levels, and integration with TUI dashboard.

use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use colored::*;

/// Log severity levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

impl LogLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            LogLevel::Trace => "TRACE",
            LogLevel::Debug => "DEBUG",
            LogLevel::Info => "INFO",
            LogLevel::Warn => "WARN",
            LogLevel::Error => "ERROR",
        }
    }

    pub fn colored_prefix(&self) -> ColoredString {
        match self {
            LogLevel::Trace => "TRACE".dimmed(),
            LogLevel::Debug => "DEBUG".blue(),
            LogLevel::Info => "INFO".green(),
            LogLevel::Warn => "WARN".yellow(),
            LogLevel::Error => "ERROR".red().bold(),
        }
    }

    pub fn emoji(&self) -> &'static str {
        match self {
            LogLevel::Trace => "🔍",
            LogLevel::Debug => "🐛",
            LogLevel::Info => "ℹ",
            LogLevel::Warn => "⚠",
            LogLevel::Error => "❌",
        }
    }
}

/// A single log entry
#[derive(Debug, Clone)]
pub struct LogEntry {
    pub timestamp: u64,
    pub level: LogLevel,
    pub message: String,
    pub source: Option<String>,
    pub file: Option<String>,
    pub line: Option<u32>,
}

impl LogEntry {
    pub fn new(level: LogLevel, message: impl Into<String>) -> Self {
        Self {
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis() as u64,
            level,
            message: message.into(),
            source: None,
            file: None,
            line: None,
        }
    }

    pub fn with_source(mut self, source: impl Into<String>) -> Self {
        self.source = Some(source.into());
        self
    }

    pub fn with_location(mut self, file: impl Into<String>, line: u32) -> Self {
        self.file = Some(file.into());
        self.line = Some(line);
        self
    }

    /// Format for terminal output
    pub fn format_terminal(&self) -> String {
        let prefix = self.level.colored_prefix();
        let emoji = self.level.emoji();
        
        let mut output = format!("{} {} {}", emoji, prefix, self.message);
        
        if let Some(ref source) = self.source {
            output.push_str(&format!(" ({})", source.dimmed()));
        }
        
        if let (Some(ref file), Some(line)) = (&self.file, self.line) {
            output.push_str(&format!(" at {}:{}", file, line));
        }
        
        output
    }

    /// Format for JSON output (structured logging)
    pub fn format_json(&self) -> String {
        let file_str = self.file.as_deref().unwrap_or("");
        let line_num = self.line.unwrap_or(0);
        let source_str = self.source.as_deref().unwrap_or("");
        
        format!(
            r#"{{"ts":{},"level":"{}","msg":"{}","src":"{}","file":"{}","line":{}}}"#,
            self.timestamp, self.level.as_str(), self.message, source_str, file_str, line_num
        )
    }
}

/// Logger configuration
#[derive(Clone)]
pub struct LoggerConfig {
    pub min_level: LogLevel,
    pub show_timestamps: bool,
    pub json_output: bool,
    pub max_entries: usize,
}

impl Default for LoggerConfig {
    fn default() -> Self {
        Self {
            min_level: LogLevel::Info,
            show_timestamps: false,
            json_output: false,
            max_entries: 1000,
        }
    }
}

/// Central logger for the Omni compiler
pub struct Logger {
    config: LoggerConfig,
    entries: Arc<Mutex<Vec<LogEntry>>>,
}

impl Logger {
    pub fn new(config: LoggerConfig) -> Self {
        Self {
            config,
            entries: Arc::new(Mutex::new(Vec::new())),
        }
    }

    /// Log a message at the specified level
    pub fn log(&self, entry: LogEntry) {
        if entry.level < self.config.min_level {
            return;
        }

        // Print to terminal
        if self.config.json_output {
            println!("{}", entry.format_json());
        } else {
            println!("{}", entry.format_terminal());
        }

        // Store in memory
        if let Ok(mut entries) = self.entries.lock() {
            entries.push(entry);
            if entries.len() > self.config.max_entries {
                entries.remove(0);
            }
        }
    }

    /// Convenience methods
    pub fn trace(&self, msg: impl Into<String>) {
        self.log(LogEntry::new(LogLevel::Trace, msg));
    }

    pub fn debug(&self, msg: impl Into<String>) {
        self.log(LogEntry::new(LogLevel::Debug, msg));
    }

    pub fn info(&self, msg: impl Into<String>) {
        self.log(LogEntry::new(LogLevel::Info, msg));
    }

    pub fn warn(&self, msg: impl Into<String>) {
        self.log(LogEntry::new(LogLevel::Warn, msg));
    }

    pub fn error(&self, msg: impl Into<String>) {
        self.log(LogEntry::new(LogLevel::Error, msg));
    }

    /// Get recent log entries for TUI display
    pub fn recent_entries(&self, count: usize) -> Vec<LogEntry> {
        if let Ok(entries) = self.entries.lock() {
            entries.iter().rev().take(count).cloned().collect()
        } else {
            Vec::new()
        }
    }

    /// Get all entries matching a minimum level
    pub fn entries_at_level(&self, min_level: LogLevel) -> Vec<LogEntry> {
        if let Ok(entries) = self.entries.lock() {
            entries.iter()
                .filter(|e| e.level >= min_level)
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    }
}

/// Global logger instance (lazy initialization)
use std::sync::OnceLock;
static GLOBAL_LOGGER: OnceLock<Logger> = OnceLock::new();

/// Initialize the global logger
pub fn init_logger(config: LoggerConfig) {
    let _ = GLOBAL_LOGGER.set(Logger::new(config));
}

/// Get the global logger (initializes with defaults if needed)
pub fn logger() -> &'static Logger {
    GLOBAL_LOGGER.get_or_init(|| Logger::new(LoggerConfig::default()))
}

/// Convenience macros for logging
#[macro_export]
macro_rules! log_trace {
    ($($arg:tt)*) => {
        $crate::core::logger::logger().trace(format!($($arg)*))
    };
}

#[macro_export]
macro_rules! log_debug {
    ($($arg:tt)*) => {
        $crate::core::logger::logger().debug(format!($($arg)*))
    };
}

#[macro_export]
macro_rules! log_info {
    ($($arg:tt)*) => {
        $crate::core::logger::logger().info(format!($($arg)*))
    };
}

#[macro_export]
macro_rules! log_warn {
    ($($arg:tt)*) => {
        $crate::core::logger::logger().warn(format!($($arg)*))
    };
}

#[macro_export]
macro_rules! log_error {
    ($($arg:tt)*) => {
        $crate::core::logger::logger().error(format!($($arg)*))
    };
}
