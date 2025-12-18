mod core;
mod targets;

use clap::{Parser, Subcommand, ValueEnum};
use std::fs;
use std::path::{Path, PathBuf};
use colored::*;
use anyhow::{Context, Result, anyhow};
use crate::core::parser::Parser as OmniParser; 
use crate::core::codegen::CodeGenerator;
use crate::core::config::OmniConfig;

#[derive(Parser)]
#[command(name = "omnic")]
#[command(about = "Compilador Oficial da Plataforma Omni", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Compila um arquivo E/OU processa omni.config.json
    Build {
        /// Caminho para o arquivo fonte .omni (Opcional se usar config)
        file: Option<PathBuf>,

        /// Mostra tokens (Debug)
        #[arg(long, short)]
        tokens: bool,

        /// Mostra AST (Debug)
        #[arg(long)]
        ast: bool,

        /// Linguagem Alvo (Ignorado se usar config)
        #[arg(long, default_value = "js")]
        target: TargetLang,
    },
}

#[derive(Clone, ValueEnum, Debug, PartialEq)]
enum TargetLang {
    Js,
    Python,
}

impl std::str::FromStr for TargetLang {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "js" | "javascript" => Ok(TargetLang::Js),
            "python" | "py" => Ok(TargetLang::Python),
            _ => Err(format!("Linguagem desconhecida: {}", s)),
        }
    }
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Build { file, tokens, ast, target } => {
            // Modo 1: Arquivo Único
            if let Some(source_file) = file {
                println!("{} {} -> {:?}", "Compilando Arquivo:".green(), source_file.display(), target);
                process_single_file(source_file, target.clone(), *tokens, *ast, None)?;
            } 
            // Modo 2: Projeto (omni.config.json)
            else {
                let config_path = Path::new("omni.config.json");
                if !config_path.exists() {
                     return Err(anyhow!("Nenhum arquivo .omni fornecido e 'omni.config.json' não encontrado."));
                }

                println!("{} {}...", "Lendo Configuração:".cyan(), config_path.display());
                let config_content = fs::read_to_string(config_path)?;
                let config: OmniConfig = serde_json::from_str(&config_content)
                    .context("Erro ao parsear omni.config.json")?;

                println!("{} {} v{}", "Projeto:".blue().bold(), config.project.name, config.project.version);

                for (target_name, target_cfg) in config.targets {
                    println!("\n>> Construindo target '{}' ({})", target_name.yellow(), target_cfg.format);

                    // Determinar Output Dir
                    let out_dir = PathBuf::from(&target_cfg.output);
                    if !out_dir.exists() {
                        fs::create_dir_all(&out_dir)?;
                    }

                    // Determinar Source
                    let source_path = target_cfg.source.clone()
                        .map(PathBuf::from)
                        .unwrap_or_else(|| PathBuf::from("src/main.omni"));
                    
                    if !source_path.exists() {
                        println!("{} Arquivo fonte não encontrado: {}", "AVISO:".red(), source_path.display());
                        continue;
                    }

                    // Identificar Lang
                    let lang_enum = match target_cfg.format.as_str().parse::<TargetLang>() {
                        Ok(l) => l,
                        Err(_) => {
                            println!("Formato desconhecido '{}'. Pulando.", target_cfg.format);
                            continue; 
                        }
                    };

                    // Processar e Salvar
                    let generated_files_result = process_single_file(&source_path, lang_enum.clone(), *tokens, *ast, Some(&out_dir));
                    if let Err(e) = generated_files_result {
                        println!("{} {}", "ERRO:".red(), e);
                        continue;
                    }

                    // 5. Packaging / Bundling (Phase 6)
                    if target_cfg.bundle == Some(true) {
                         // Define Shebang based on Lang
                         // TODO: Node support requires some tricks, doing only Python for MVP ZipApp as requested
                         let (shebang, ext) = match lang_enum {
                             TargetLang::Python => ("#!/usr/bin/env python3", "run"),
                             TargetLang::Js => ("#!/usr/bin/env node", "run"), // Try simple concat for JS or Zip if node supports
                         };

                         let bundle_name = format!("{}.{}", target_name, ext);
                         let bundle_path = out_dir.join(bundle_name); // Salva dentro da dist
                         
                         println!("   📦 Empacotando para: {}", bundle_path.display());
                         
                         match core::packager::create_bundle(&out_dir, &bundle_path, shebang) {
                             Ok(_) => println!("   ✨ Bundle criado com sucesso!"),
                             Err(e) => println!("   ⚠️ Falha no empacotamento: {}", e),
                         }
                    }
                }
                println!("\n{}", "Build de Projeto Concluído!".green().bold());
            }
        }
    }

    Ok(())
}

fn process_single_file(
    path: &Path, 
    lang: TargetLang, 
    debug_tokens: bool, 
    debug_ast: bool, 
    out_dir: Option<&Path>
) -> Result<()> {
    // 1. Read
    let content = fs::read_to_string(path)
        .with_context(|| format!("Erro lendo {}", path.display()))?;

    // 2. Lex / Parse
    let lexer = core::lexer::Lexer::new(&content);
    let mut parser = OmniParser::new(lexer);
    
    if debug_tokens {
        // ... (código de debug simplificado)
    }

    let program = match parser.parse_program() {
        Ok(p) => p,
        Err(e) => return Err(anyhow!("Erro de Parsing em {}: {}", path.display(), e)),
    };

    if debug_ast {
        println!("{:#?}", program);
    }

    // 3. Generate
    let backend: Box<dyn CodeGenerator> = match lang {
        TargetLang::Js => Box::new(targets::js::JsBackend::new()),
        TargetLang::Python => Box::new(targets::python::PythonBackend::new()),
    };

    let code = backend.generate(&program)?;

    // 4. Output
    if let Some(dir) = out_dir {
        // Para Python ZipApp, precisamos de um __main__.py
        let filename = match lang {
            TargetLang::Js => "index.js", // Main JS entry
            TargetLang::Python => "__main__.py", // Main Python ZipApp entry
        };
        
        let out_path = dir.join(filename);
        fs::write(&out_path, code)?;
        println!("   {} Gerado: {}", "✔".green(), out_path.display());
    } else {
        println!("{}", code);
    }

    Ok(())
}
