pub mod token;
pub mod lexer;
pub mod ast;
pub mod parser;
pub mod codegen;
pub mod semantic; // Semantic analysis with SymbolTable and TypeChecker
pub mod resolver; // Module resolution and import handling
pub mod optimizer; // Constant folding and optimization passes
pub mod watcher; // Hot reload file watching
pub mod tui; // Rich terminal UI with ratatui
pub mod logger; // Unified logging system
pub mod settings; // Global configuration center
pub mod checksum; // SHA-256 checksums for omni.lock
pub mod context; // OMNI_CONTEXT.json persistence
pub mod audit; // Security and quality scanning
pub mod secrets; // .env and secret management
pub mod upgrade; // Binary self-update
pub mod changelog; // Automatic changelog generation
pub mod cache; // Offline mode package cache
pub mod signing; // Package signing and verification
pub mod bytecode; // Binary bytecode format (.omnb)
pub mod sandbox; // Native block isolation
pub mod envman; // Runtime version management
pub mod docindex; // AI-ready documentation indexer
pub mod tutorial; // Interactive step-by-step tutorial
pub mod testrunner; // QA parity test runner
pub mod faq; // Searchable FAQ system
pub mod metamorph; // Framework adapters
pub mod diagramgen; // Mermaid diagram generator
pub mod roadmap; // Visual roadmap tracker
// pub mod phpingest; // Deprecated by core/ingest
// pub mod jsingest; // Deprecated by core/ingest
// pub mod pyingest; // Deprecated by core/ingest
pub mod typeinfer; // Type inference engine
pub mod diffinspect; // Diff inspector for ingestion
pub mod ingest; // Unified ingestion command
pub mod registry; // Package registry client
pub mod templates; // Project scaffolding templates
pub mod profiler; // Build performance profiler
pub mod lsp; // Language Server Protocol
pub mod docker; // Docker file generation
pub mod swagger; // OpenAPI/Swagger generator
pub mod graphql; // GraphQL schema generator
pub mod sqlgen; // SQL dialect generator
pub mod stdlib; // Standard library expansion
pub mod reactgen; // React/JSX generator
pub mod laravelgen; // Laravel PHP generator
pub mod vuegen; // Vue/Svelte generator
pub mod cgen; // Native C generator
// pub mod laravelingest; // Deprecated
// pub mod yiiingest; // Deprecated
// pub mod reactingest; // Deprecated
pub mod docextract; // Docstring extraction
pub mod config;
// pub mod packager; // New export
