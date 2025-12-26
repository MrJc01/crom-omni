//! Interactive Tutorial - Step-by-Step TUI Guide
//!
//! Provides an interactive guided tutorial for learning Omni.

use serde::{Deserialize, Serialize};
use colored::*;
use std::io::{self, Write};

/// Tutorial step
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TutorialStep {
    /// Step title
    pub title: String,
    /// Step description
    pub description: String,
    /// Code example
    pub code: Option<String>,
    /// Expected output
    pub expected: Option<String>,
    /// Hint for the user
    pub hint: Option<String>,
    /// Command to try
    pub try_command: Option<String>,
}

/// Tutorial lesson containing multiple steps
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lesson {
    /// Lesson name
    pub name: String,
    /// Lesson description
    pub description: String,
    /// All steps in this lesson
    pub steps: Vec<TutorialStep>,
}

/// Complete tutorial course
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tutorial {
    /// Tutorial title
    pub title: String,
    /// All lessons
    pub lessons: Vec<Lesson>,
}

impl Tutorial {
    /// Create the default Omni tutorial
    pub fn default_course() -> Self {
        Self {
            title: "Welcome to Omni!".to_string(),
            lessons: vec![
                Lesson {
                    name: "Getting Started".to_string(),
                    description: "Learn the basics of Omni".to_string(),
                    steps: vec![
                        TutorialStep {
                            title: "Hello World".to_string(),
                            description: "Let's write your first Omni program".to_string(),
                            code: Some(r#"fn main() {
    println("Hello, Omni!");
}"#.to_string()),
                            expected: Some("Hello, Omni!".to_string()),
                            hint: Some("The println function outputs text to the console".to_string()),
                            try_command: Some("omni run hello.omni".to_string()),
                        },
                        TutorialStep {
                            title: "Variables".to_string(),
                            description: "Learn how to declare and use variables".to_string(),
                            code: Some(r#"fn main() {
    let name = "World";
    let count = 42;
    println("Hello, " + name + "!");
    println("Count: " + count);
}"#.to_string()),
                            expected: Some("Hello, World!\nCount: 42".to_string()),
                            hint: Some("Use 'let' to declare variables".to_string()),
                            try_command: None,
                        },
                        TutorialStep {
                            title: "Functions".to_string(),
                            description: "Create reusable functions".to_string(),
                            code: Some(r#"fn greet(name: String) -> String {
    return "Hello, " + name + "!";
}

fn main() {
    let message = greet("Omni");
    println(message);
}"#.to_string()),
                            expected: Some("Hello, Omni!".to_string()),
                            hint: Some("Functions can take parameters and return values".to_string()),
                            try_command: None,
                        },
                    ],
                },
                Lesson {
                    name: "Control Flow".to_string(),
                    description: "Learn conditionals and loops".to_string(),
                    steps: vec![
                        TutorialStep {
                            title: "If/Else".to_string(),
                            description: "Make decisions in your code".to_string(),
                            code: Some(r#"fn main() {
    let age = 18;
    if age >= 18 {
        println("Adult");
    } else {
        println("Minor");
    }
}"#.to_string()),
                            expected: Some("Adult".to_string()),
                            hint: Some("Use comparison operators: ==, !=, <, >, <=, >=".to_string()),
                            try_command: None,
                        },
                        TutorialStep {
                            title: "Loops".to_string(),
                            description: "Repeat code with loops".to_string(),
                            code: Some(r#"fn main() {
    for i in 0..5 {
        println(i);
    }
}"#.to_string()),
                            expected: Some("0\n1\n2\n3\n4".to_string()),
                            hint: Some("Use 'for in' for iteration, 'while' for conditions".to_string()),
                            try_command: None,
                        },
                    ],
                },
                Lesson {
                    name: "Multi-Target".to_string(),
                    description: "Compile to multiple languages".to_string(),
                    steps: vec![
                        TutorialStep {
                            title: "Compile to JavaScript".to_string(),
                            description: "Generate JavaScript from Omni".to_string(),
                            code: None,
                            expected: None,
                            hint: Some("The default target is JavaScript/Node.js".to_string()),
                            try_command: Some("omni build hello.omni --js".to_string()),
                        },
                        TutorialStep {
                            title: "Compile to PHP".to_string(),
                            description: "Generate PHP from Omni".to_string(),
                            code: None,
                            expected: None,
                            hint: Some("PHP output works with any PHP 7.4+ environment".to_string()),
                            try_command: Some("omni build hello.omni --php".to_string()),
                        },
                    ],
                },
            ],
        }
    }
}

/// Interactive tutorial runner
pub struct TutorialRunner {
    tutorial: Tutorial,
    current_lesson: usize,
    current_step: usize,
}

impl TutorialRunner {
    pub fn new(tutorial: Tutorial) -> Self {
        Self {
            tutorial,
            current_lesson: 0,
            current_step: 0,
        }
    }

    /// Start the tutorial
    pub fn run(&mut self) {
        self.print_header();
        
        loop {
            if !self.show_current_step() {
                break;
            }
            
            match self.prompt_action() {
                Action::Next => self.next(),
                Action::Previous => self.previous(),
                Action::Skip => self.skip_lesson(),
                Action::Quit => break,
                Action::Repeat => continue,
            }
        }
        
        self.print_footer();
    }

    fn print_header(&self) {
        println!();
        println!("{}", "╔═══════════════════════════════════════════╗".cyan());
        println!("{}", format!("║  {}  ║", self.tutorial.title).cyan().bold());
        println!("{}", "╚═══════════════════════════════════════════╝".cyan());
        println!();
    }

    fn print_footer(&self) {
        println!();
        println!("{}", "🎉 Tutorial complete! You're ready to build with Omni.".green().bold());
        println!();
    }

    fn show_current_step(&self) -> bool {
        if self.current_lesson >= self.tutorial.lessons.len() {
            return false;
        }

        let lesson = &self.tutorial.lessons[self.current_lesson];
        if self.current_step >= lesson.steps.len() {
            return false;
        }

        let step = &lesson.steps[self.current_step];

        println!();
        println!("{}", format!("── Lesson {}: {} ──", 
            self.current_lesson + 1, 
            lesson.name
        ).yellow().bold());
        println!();
        println!("{}", format!("Step {}/{}: {}", 
            self.current_step + 1, 
            lesson.steps.len(),
            step.title
        ).white().bold());
        println!();
        println!("{}", step.description);

        if let Some(ref code) = step.code {
            println!();
            println!("{}", "Code:".cyan());
            println!("{}", "```".dimmed());
            for line in code.lines() {
                println!("  {}", line);
            }
            println!("{}", "```".dimmed());
        }

        if let Some(ref hint) = step.hint {
            println!();
            println!("{} {}", "💡 Hint:".yellow(), hint);
        }

        if let Some(ref cmd) = step.try_command {
            println!();
            println!("{} {}", "▶ Try:".green(), cmd);
        }

        true
    }

    fn prompt_action(&self) -> Action {
        println!();
        print!("{}", "[N]ext  [P]revious  [S]kip lesson  [Q]uit > ".dimmed());
        io::stdout().flush().unwrap();

        let mut input = String::new();
        io::stdin().read_line(&mut input).ok();

        match input.trim().to_lowercase().as_str() {
            "n" | "next" | "" => Action::Next,
            "p" | "previous" | "prev" => Action::Previous,
            "s" | "skip" => Action::Skip,
            "q" | "quit" | "exit" => Action::Quit,
            _ => Action::Repeat,
        }
    }

    fn next(&mut self) {
        let lesson = &self.tutorial.lessons[self.current_lesson];
        if self.current_step + 1 < lesson.steps.len() {
            self.current_step += 1;
        } else if self.current_lesson + 1 < self.tutorial.lessons.len() {
            self.current_lesson += 1;
            self.current_step = 0;
        }
    }

    fn previous(&mut self) {
        if self.current_step > 0 {
            self.current_step -= 1;
        } else if self.current_lesson > 0 {
            self.current_lesson -= 1;
            self.current_step = self.tutorial.lessons[self.current_lesson].steps.len().saturating_sub(1);
        }
    }

    fn skip_lesson(&mut self) {
        if self.current_lesson + 1 < self.tutorial.lessons.len() {
            self.current_lesson += 1;
            self.current_step = 0;
        }
    }
}

#[derive(Debug)]
enum Action {
    Next,
    Previous,
    Skip,
    Quit,
    Repeat,
}

/// Run the interactive tutorial
pub fn run_tutorial() {
    let tutorial = Tutorial::default_course();
    let mut runner = TutorialRunner::new(tutorial);
    runner.run();
}
