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
use crate::core::semantic;
use rayon::prelude::*;

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

        /// Caminho para o arquivo de saida (Opcional)
        output_file: Option<PathBuf>,

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
        Commands::Build { file, output_file, tokens, ast, target } => {
            // Modo 1: Arquivo Único
            if let Some(source_file) = file {
                eprintln!("{} {} -> {:?}", "Compilando Arquivo:".green(), source_file.display(), target);
                process_single_file(source_file, target.clone(), *tokens, *ast, output_file.as_deref())?;
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

                // Parallel compilation of targets using Rayon
                let targets: Vec<_> = config.targets.into_iter().collect();
                targets.par_iter().for_each(|(target_name, target_cfg)| {
                    println!("\n>> Construindo target '{}' ({})", target_name.yellow(), target_cfg.format);

                    let out_dir = PathBuf::from(&target_cfg.output);
                    if !out_dir.exists() {
                        let _ = fs::create_dir_all(&out_dir);
                    }

                    let source_path = target_cfg.source.clone()
                        .map(PathBuf::from)
                        .unwrap_or_else(|| PathBuf::from("src/main.omni"));
                    
                    if !source_path.exists() {
                        println!("{} Arquivo fonte não encontrado: {}", "AVISO:".red(), source_path.display());
                        return;
                    }

                    let lang_enum = match target_cfg.format.as_str().parse::<TargetLang>() {
                        Ok(l) => l,
                        Err(_) => {
                            println!("Formato desconhecido '{}'. Pulando.", target_cfg.format);
                            return; 
                        }
                    };

                    let generated_files_result = process_single_file(&source_path, lang_enum.clone(), *tokens, *ast, Some(&out_dir));
                    if let Err(e) = generated_files_result {
                        println!("{} {}", "ERRO:".red(), e);
                        return;
                    }

                    if target_cfg.bundle == Some(true) {
                         let (shebang, ext) = match lang_enum {
                             TargetLang::Python => ("#!/usr/bin/env python3", "run"),
                             TargetLang::Js => ("#!/usr/bin/env node", "run"),
                         };

                         let bundle_name = format!("{}.{}", target_name, ext);
                         let bundle_path = out_dir.join(bundle_name);
                         
                         println!("   📦 Empacotando para: {}", bundle_path.display());
                         
                         match core::packager::create_bundle(&out_dir, &bundle_path, shebang) {
                             Ok(_) => println!("   ✨ Bundle criado com sucesso!"),
                             Err(e) => println!("   ⚠️ Falha no empacotamento: {}", e),
                         }
                    }
                });
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
    // 0. Carregar Prelude/Std Lib
    // Check multiple locations
    let possible_paths = [
        "lib/std/io.omni",
        "omnic/lib/std/io.omni",
        "std/io.omni",
    ];
    
    let mut std_content = String::new();
    for p in possible_paths {
        let path = Path::new(p);
        if path.exists() {
             std_content = fs::read_to_string(path).unwrap_or_default();
             std_content.push('\n'); 
             println!("   📚 StdLib Carregada: {}", p);
             break;
        }
    }

    // 1. Read
    let user_content = fs::read_to_string(path)
        .with_context(|| format!("Erro lendo {}", path.display()))?;
    
    // Concatenar Std + User (Prelude injection)
    let full_content = format!("{}{}", std_content, user_content);

    // 2. Lex / Parse
    let lexer = core::lexer::Lexer::new(&full_content);
    let mut parser = OmniParser::new(lexer, &full_content);
    
    let program = match parser.parse_program() {
        Ok(p) => p,
        Err(e) => return Err(anyhow!("Erro de Parsing em {}: {}", path.display(), e)),
    };

    if debug_ast {
        println!("{:#?}", program);
    }

    // 2.5 Semantic Analysis (Type Checking)
    let analyzer = semantic::SemanticAnalyzer::new();
    let mut analyzer = analyzer;
    if let Err(e) = analyzer.analyze(&program) {
        eprintln!("{} {}", "Semantic Warning:".yellow(), e);
        // Continue anyway - semantic errors are warnings for now
    }
    for warning in &analyzer.warnings {
        eprintln!("   {} {}", "⚠".yellow(), warning);
    }

    // 3. Generate
    let backend: Box<dyn CodeGenerator> = match lang {
        TargetLang::Js => Box::new(targets::js::JsBackend::new()),
        TargetLang::Python => Box::new(targets::python::PythonBackend::new()),
    };

    let code = backend.generate(&program)?;

    // 4. Output
    // 4. Output
    if let Some(out_path) = out_dir {
        // If out_path has extension, treat as file. If not, treat as dir.
        let final_path = if out_path.extension().is_some() {
            out_path.to_path_buf()
        } else {
            let filename = match lang {
                TargetLang::Js => "index.js",
                TargetLang::Python => "__main__.py",
            };
            out_path.join(filename)
        };

        if let Some(parent) = final_path.parent() {
            if !parent.exists() {
               let _ = fs::create_dir_all(parent);
            }
        }
        
        fs::write(&final_path, code)?;
        println!("   {} Gerado: {}", "✔".green(), final_path.display());
    } else {
        println!("{}", code);
    }

    Ok(())
}
