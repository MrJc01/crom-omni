use std::path::Path;
use std::fs;
use anyhow::{Result, Context};
use colored::*;

pub fn clean() -> Result<()> {
    println!("{} Limpando ambiente...", "🧹".yellow());
    let dirs = ["dist", "target", "__pycache__"];
    let files = ["npm-debug.log", "error.log"];
    
    for d in dirs {
        let p = Path::new(d);
        if p.exists() {
             fs::remove_dir_all(p).with_context(|| format!("Falha ao remover {}", d))?;
             println!("   🗑️  Removido: {}/", d);
        }
    }
    // Logic to remove patterns like *.log or temp_* would require walkdir or glob
    // For now, simple list
     for f in files {
        let p = Path::new(f);
        if p.exists() {
             fs::remove_file(p)?;
             println!("   🗑️  Removido: {}", f);
        }
    }
    println!("{}", "Limpeza Concluída!".green());
    Ok(())
}
