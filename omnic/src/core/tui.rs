//! TUI 2.0 - Rich Terminal User Interface
//!
//! Interactive terminal dashboard using ratatui for the Omni compiler.

use std::io::{self, stdout, Stdout};
use crossterm::{
    event::{self, Event, KeyCode, KeyEventKind},
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
    ExecutableCommand,
};
use ratatui::{
    prelude::*,
    widgets::{Block, Borders, Gauge, List, ListItem, Paragraph},
};

/// TUI Application State
pub struct TuiApp {
    /// Current tab/view
    current_view: TuiView,
    /// Build progress (0-100)
    build_progress: u16,
    /// Recent log messages
    logs: Vec<String>,
    /// Status message
    status: String,
    /// Should quit
    should_quit: bool,
}

#[derive(Clone, Copy, PartialEq)]
pub enum TuiView {
    Dashboard,
    Logs,
    Help,
}

impl Default for TuiApp {
    fn default() -> Self {
        Self {
            current_view: TuiView::Dashboard,
            build_progress: 0,
            logs: vec![
                "🚀 Omni Compiler TUI Initialized".to_string(),
                "📁 Watching for file changes...".to_string(),
            ],
            status: "Ready".to_string(),
            should_quit: false,
        }
    }
}

impl TuiApp {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add a log message
    pub fn log(&mut self, message: &str) {
        self.logs.push(message.to_string());
        // Keep last 100 logs
        if self.logs.len() > 100 {
            self.logs.remove(0);
        }
    }

    /// Update build progress
    pub fn set_progress(&mut self, progress: u16) {
        self.build_progress = progress.min(100);
    }

    /// Update status
    pub fn set_status(&mut self, status: &str) {
        self.status = status.to_string();
    }

    /// Handle key events
    pub fn handle_key(&mut self, key: KeyCode) {
        match key {
            KeyCode::Char('q') | KeyCode::Esc => self.should_quit = true,
            KeyCode::Char('1') => self.current_view = TuiView::Dashboard,
            KeyCode::Char('2') => self.current_view = TuiView::Logs,
            KeyCode::Char('h') | KeyCode::Char('?') => self.current_view = TuiView::Help,
            _ => {}
        }
    }
}

/// Terminal wrapper for ratatui
pub struct Terminal {
    terminal: ratatui::Terminal<CrosstermBackend<Stdout>>,
}

impl Terminal {
    pub fn new() -> io::Result<Self> {
        enable_raw_mode()?;
        stdout().execute(EnterAlternateScreen)?;
        let backend = CrosstermBackend::new(stdout());
        let terminal = ratatui::Terminal::new(backend)?;
        Ok(Self { terminal })
    }

    pub fn restore(&mut self) -> io::Result<()> {
        disable_raw_mode()?;
        stdout().execute(LeaveAlternateScreen)?;
        Ok(())
    }

    pub fn draw(&mut self, app: &TuiApp) -> io::Result<()> {
        self.terminal.draw(|frame| {
            let area = frame.area();
            
            // Main layout
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(3), // Header
                    Constraint::Min(10),   // Content
                    Constraint::Length(3), // Footer
                ])
                .split(area);

            // Header
            let header = Paragraph::new("🔮 Omni Compiler Dashboard")
                .style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD))
                .block(Block::default().borders(Borders::ALL).title("Omni TUI 2.0"));
            frame.render_widget(header, chunks[0]);

            // Content based on current view
            match app.current_view {
                TuiView::Dashboard => render_dashboard(frame, chunks[1], app),
                TuiView::Logs => render_logs(frame, chunks[1], app),
                TuiView::Help => render_help(frame, chunks[1]),
            }

            // Footer
            let footer = Paragraph::new(format!(
                "[1] Dashboard  [2] Logs  [H] Help  [Q] Quit | Status: {}",
                app.status
            ))
            .style(Style::default().fg(Color::Gray))
            .block(Block::default().borders(Borders::ALL));
            frame.render_widget(footer, chunks[2]);
        })?;
        Ok(())
    }
}

fn render_dashboard(frame: &mut Frame, area: Rect, app: &TuiApp) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3), // Progress bar
            Constraint::Min(5),    // Stats
        ])
        .split(area);

    // Build progress
    let progress = Gauge::default()
        .block(Block::default().borders(Borders::ALL).title("Build Progress"))
        .gauge_style(Style::default().fg(Color::Green))
        .percent(app.build_progress);
    frame.render_widget(progress, chunks[0]);

    // Dashboard info
    let info = Paragraph::new(vec![
        Line::from(vec![
            Span::styled("🔧 Compiler: ", Style::default().fg(Color::Yellow)),
            Span::raw("omnic v0.1.0"),
        ]),
        Line::from(vec![
            Span::styled("📁 Watching: ", Style::default().fg(Color::Yellow)),
            Span::raw("*.omni files"),
        ]),
        Line::from(vec![
            Span::styled("🎯 Target: ", Style::default().fg(Color::Yellow)),
            Span::raw("JavaScript"),
        ]),
        Line::from(vec![
            Span::styled("📊 Files: ", Style::default().fg(Color::Yellow)),
            Span::raw("0 compiled"),
        ]),
    ])
    .block(Block::default().borders(Borders::ALL).title("Status"));
    frame.render_widget(info, chunks[1]);
}

fn render_logs(frame: &mut Frame, area: Rect, app: &TuiApp) {
    let items: Vec<ListItem> = app.logs
        .iter()
        .rev()
        .take(20)
        .map(|log| ListItem::new(log.as_str()))
        .collect();

    let list = List::new(items)
        .block(Block::default().borders(Borders::ALL).title("Build Logs"))
        .style(Style::default().fg(Color::White));
    frame.render_widget(list, area);
}

fn render_help(frame: &mut Frame, area: Rect) {
    let help_text = vec![
        Line::from("Keyboard Shortcuts:"),
        Line::from(""),
        Line::from(vec![
            Span::styled("  1 ", Style::default().fg(Color::Cyan)),
            Span::raw("- Dashboard view"),
        ]),
        Line::from(vec![
            Span::styled("  2 ", Style::default().fg(Color::Cyan)),
            Span::raw("- Logs view"),
        ]),
        Line::from(vec![
            Span::styled("  H ", Style::default().fg(Color::Cyan)),
            Span::raw("- This help screen"),
        ]),
        Line::from(vec![
            Span::styled("  Q ", Style::default().fg(Color::Cyan)),
            Span::raw("- Quit"),
        ]),
    ];

    let help = Paragraph::new(help_text)
        .block(Block::default().borders(Borders::ALL).title("Help"));
    frame.render_widget(help, area);
}

/// Run the TUI application
pub fn run_tui() -> io::Result<()> {
    let mut terminal = Terminal::new()?;
    let mut app = TuiApp::new();

    loop {
        terminal.draw(&app)?;

        if event::poll(std::time::Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    app.handle_key(key.code);
                }
            }
        }

        if app.should_quit {
            break;
        }
    }

    terminal.restore()?;
    Ok(())
}
