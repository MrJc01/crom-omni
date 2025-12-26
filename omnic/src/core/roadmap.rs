//! Roadmap Visual - Progress Tracking Panel
//!
//! Visual roadmap for tracking Omni project development progress.

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use colored::*;

/// Task status
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TaskStatus {
    NotStarted,
    InProgress,
    Completed,
    Blocked,
}

impl TaskStatus {
    pub fn icon(&self) -> &'static str {
        match self {
            TaskStatus::NotStarted => "○",
            TaskStatus::InProgress => "◐",
            TaskStatus::Completed => "●",
            TaskStatus::Blocked => "⊘",
        }
    }

    pub fn colored_icon(&self) -> String {
        match self {
            TaskStatus::NotStarted => "○".dimmed().to_string(),
            TaskStatus::InProgress => "◐".yellow().to_string(),
            TaskStatus::Completed => "●".green().to_string(),
            TaskStatus::Blocked => "⊘".red().to_string(),
        }
    }
}

/// A milestone in the roadmap
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Milestone {
    pub id: String,
    pub name: String,
    pub description: String,
    pub tasks: Vec<RoadmapTask>,
    pub target_version: Option<String>,
}

impl Milestone {
    pub fn progress(&self) -> f32 {
        if self.tasks.is_empty() {
            return 0.0;
        }
        let completed = self.tasks.iter()
            .filter(|t| t.status == TaskStatus::Completed)
            .count();
        (completed as f32 / self.tasks.len() as f32) * 100.0
    }

    pub fn is_complete(&self) -> bool {
        self.tasks.iter().all(|t| t.status == TaskStatus::Completed)
    }
}

/// A task in the roadmap
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoadmapTask {
    pub id: String,
    pub name: String,
    pub status: TaskStatus,
    pub module: Option<String>,
    pub priority: u8,
}

/// Complete roadmap
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Roadmap {
    pub title: String,
    pub milestones: Vec<Milestone>,
}

impl Roadmap {
    pub fn new(title: &str) -> Self {
        Self {
            title: title.to_string(),
            milestones: Vec::new(),
        }
    }

    pub fn add_milestone(&mut self, milestone: Milestone) {
        self.milestones.push(milestone);
    }

    /// Calculate overall progress
    pub fn overall_progress(&self) -> f32 {
        if self.milestones.is_empty() {
            return 0.0;
        }
        let total: f32 = self.milestones.iter().map(|m| m.progress()).sum();
        total / self.milestones.len() as f32
    }

    /// Display progress bar
    fn progress_bar(percent: f32, width: usize) -> String {
        let filled = ((percent / 100.0) * width as f32) as usize;
        let empty = width.saturating_sub(filled);
        format!("[{}{}] {:>5.1}%",
            "█".repeat(filled).green(),
            "░".repeat(empty).dimmed(),
            percent
        )
    }

    /// Display roadmap in terminal
    pub fn display(&self) {
        println!();
        println!("{}", format!("🗺 {}", self.title).cyan().bold());
        println!();

        // Overall progress
        let overall = self.overall_progress();
        println!("Overall: {}", Self::progress_bar(overall, 30));
        println!();

        // Milestones
        for (i, milestone) in self.milestones.iter().enumerate() {
            let icon = if milestone.is_complete() {
                "✓".green()
            } else {
                format!("{}", i + 1).yellow()
            };
            
            println!("{} {} ({})", 
                icon,
                milestone.name.bold(),
                Self::progress_bar(milestone.progress(), 20)
            );
            
            if let Some(ref ver) = milestone.target_version {
                println!("   Version: {}", ver.dimmed());
            }

            // Tasks
            for task in &milestone.tasks {
                println!("   {} {}{}", 
                    task.status.colored_icon(),
                    task.name,
                    task.module.as_ref()
                        .map(|m| format!(" ({})", m.dimmed()))
                        .unwrap_or_default()
                );
            }
            println!();
        }
    }

    /// Generate Mermaid gantt chart
    pub fn to_mermaid_gantt(&self) -> String {
        let mut output = String::new();
        output.push_str("```mermaid\ngantt\n");
        output.push_str(&format!("    title {}\n", self.title));
        output.push_str("    dateFormat YYYY-MM-DD\n");
        
        for milestone in &self.milestones {
            output.push_str(&format!("    section {}\n", milestone.name));
            for task in &milestone.tasks {
                let status = match task.status {
                    TaskStatus::Completed => "done",
                    TaskStatus::InProgress => "active",
                    _ => "",
                };
                output.push_str(&format!("    {} :{}, a{}, 1d\n", 
                    task.name, status, task.id));
            }
        }
        
        output.push_str("```\n");
        output
    }
}

/// Create Omni development roadmap
pub fn omni_roadmap() -> Roadmap {
    let mut roadmap = Roadmap::new("Omni Compiler Roadmap");

    roadmap.add_milestone(Milestone {
        id: "core".into(),
        name: "Nível 1: Core Compiler".into(),
        description: "Core compilation pipeline".into(),
        target_version: Some("0.1.0".into()),
        tasks: vec![
            RoadmapTask { id: "1".into(), name: "Lexer".into(), status: TaskStatus::Completed, module: Some("lexer.rs".into()), priority: 1 },
            RoadmapTask { id: "2".into(), name: "Parser".into(), status: TaskStatus::Completed, module: Some("parser.rs".into()), priority: 1 },
            RoadmapTask { id: "3".into(), name: "Semantic Analyzer".into(), status: TaskStatus::Completed, module: Some("semantic.rs".into()), priority: 1 },
            RoadmapTask { id: "4".into(), name: "Code Generator".into(), status: TaskStatus::Completed, module: Some("codegen.rs".into()), priority: 1 },
            RoadmapTask { id: "5".into(), name: "Optimizer".into(), status: TaskStatus::Completed, module: Some("optimizer.rs".into()), priority: 2 },
            RoadmapTask { id: "6".into(), name: "Bytecode Backend".into(), status: TaskStatus::Completed, module: Some("bytecode.rs".into()), priority: 3 },
        ],
    });

    roadmap.add_milestone(Milestone {
        id: "dx".into(),
        name: "Nível 4: Developer Experience".into(),
        description: "Developer tools and experience".into(),
        target_version: Some("0.2.0".into()),
        tasks: vec![
            RoadmapTask { id: "7".into(), name: "Hot Reload".into(), status: TaskStatus::Completed, module: Some("watcher.rs".into()), priority: 1 },
            RoadmapTask { id: "8".into(), name: "TUI Dashboard".into(), status: TaskStatus::Completed, module: Some("tui.rs".into()), priority: 2 },
            RoadmapTask { id: "9".into(), name: "Environment Manager".into(), status: TaskStatus::Completed, module: Some("envman.rs".into()), priority: 2 },
        ],
    });

    roadmap.add_milestone(Milestone {
        id: "security".into(),
        name: "Nível 5: Security".into(),
        description: "Security and sovereignty".into(),
        target_version: Some("0.3.0".into()),
        tasks: vec![
            RoadmapTask { id: "10".into(), name: "Checksum Validation".into(), status: TaskStatus::Completed, module: Some("checksum.rs".into()), priority: 1 },
            RoadmapTask { id: "11".into(), name: "Audit Tool".into(), status: TaskStatus::Completed, module: Some("audit.rs".into()), priority: 1 },
            RoadmapTask { id: "12".into(), name: "Native Sandbox".into(), status: TaskStatus::Completed, module: Some("sandbox.rs".into()), priority: 2 },
            RoadmapTask { id: "13".into(), name: "Package Signing".into(), status: TaskStatus::Completed, module: Some("signing.rs".into()), priority: 2 },
        ],
    });

    roadmap
}

/// Display roadmap command
pub fn show_roadmap() {
    let roadmap = omni_roadmap();
    roadmap.display();
}
