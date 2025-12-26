//! Hot Reload Engine for Omni Compiler
//!
//! Monitors .omni files for changes and triggers automatic recompilation.

use std::path::{Path, PathBuf};
use std::sync::mpsc::channel;
use std::time::Duration;
use notify::{Watcher, RecursiveMode, Result as NotifyResult, Config, Event, RecommendedWatcher};
use colored::*;

/// Hot Reload configuration
pub struct HotReloadConfig {
    /// Root directory to watch
    pub watch_dir: PathBuf,
    /// File extension to watch (default: "omni")
    pub extension: String,
    /// Debounce duration in milliseconds
    pub debounce_ms: u64,
}

impl Default for HotReloadConfig {
    fn default() -> Self {
        Self {
            watch_dir: PathBuf::from("."),
            extension: "omni".to_string(),
            debounce_ms: 300,
        }
    }
}

/// Hot Reloader - watches files and triggers recompilation
pub struct HotReloader {
    config: HotReloadConfig,
}

impl HotReloader {
    pub fn new(config: HotReloadConfig) -> Self {
        Self { config }
    }

    /// Start watching files and call the callback on changes
    pub fn watch<F>(&self, on_change: F) -> NotifyResult<()>
    where
        F: Fn(&Path) + Send + 'static,
    {
        let (tx, rx) = channel();
        let extension = self.config.extension.clone();

        // Create a watcher
        let mut watcher = RecommendedWatcher::new(
            move |res: NotifyResult<Event>| {
                if let Ok(event) = res {
                    for path in event.paths {
                        if let Some(ext) = path.extension() {
                            if ext == extension.as_str() {
                                let _ = tx.send(path);
                            }
                        }
                    }
                }
            },
            Config::default().with_poll_interval(Duration::from_millis(self.config.debounce_ms)),
        )?;

        // Watch the directory recursively
        watcher.watch(&self.config.watch_dir, RecursiveMode::Recursive)?;

        println!("{} Watching {} for .{} changes...",
            "🔥".yellow(),
            self.config.watch_dir.display(),
            self.config.extension
        );
        println!("{} Press Ctrl+C to stop",
            "ℹ".blue()
        );

        // Process events
        loop {
            match rx.recv() {
                Ok(path) => {
                    println!("\n{} File changed: {}",
                        "↻".cyan(),
                        path.display()
                    );
                    on_change(&path);
                }
                Err(_) => break,
            }
        }

        Ok(())
    }

    /// Watch and recompile using a specific compile function
    pub fn watch_and_compile<F>(&self, compile_fn: F) -> NotifyResult<()>
    where
        F: Fn(&Path) -> Result<(), String> + Send + 'static,
    {
        self.watch(move |path| {
            println!("{} Recompiling...", "⚙".yellow());
            
            match compile_fn(path) {
                Ok(()) => {
                    println!("{} Compilation successful!", "✓".green());
                }
                Err(e) => {
                    println!("{} Compilation failed: {}", "✗".red(), e);
                }
            }
        })
    }
}

/// Helper function to start hot reload with default settings
pub fn start_hot_reload<F>(
    watch_dir: &Path,
    on_change: F,
) -> NotifyResult<()>
where
    F: Fn(&Path) + Send + 'static,
{
    let config = HotReloadConfig {
        watch_dir: watch_dir.to_path_buf(),
        ..Default::default()
    };
    
    let reloader = HotReloader::new(config);
    reloader.watch(on_change)
}

/// Helper function to create a hot reload watcher for omni files
pub fn create_watcher(watch_dir: &Path) -> NotifyResult<HotReloader> {
    let config = HotReloadConfig {
        watch_dir: watch_dir.to_path_buf(),
        ..Default::default()
    };
    
    Ok(HotReloader::new(config))
}
