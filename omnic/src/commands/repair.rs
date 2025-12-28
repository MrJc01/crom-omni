use std::process::Command;
use std::fs;
use std::path::Path;
use colored::*;
use anyhow::Result;

pub fn clean_build_artifacts() -> Result<()> {
    println!("{}", "🚑 Omni Repair: Initiating Deep Clean...".yellow().bold());

    // 1. Kill Lingering Processes (Windows specific for now)
    if cfg!(target_os = "windows") {
        println!("   🔪 Killing lingering omnic.exe processes...");
        let _ = Command::new("taskkill")
            .args(["/F", "/IM", "omnic.exe"])
            .output();
        let _ = Command::new("taskkill")
            .args(["/F", "/IM", "omnic_shadow.exe"])
            .output();
    }

    // 2. Remove Target Directory
    let target_dir = Path::new("omnic/target");
    if target_dir.exists() {
        println!("   🗑️  Removing target directory: {}", target_dir.display());
        if let Err(e) = fs::remove_dir_all(target_dir) {
            println!("      {} Failed to remove target: {}", "⚠️".red(), e);
            println!("      Try closing IDEs or terminals ensuring no locks.");
        } else {
            println!("      ✅ Target cleaned.");
        }
    } else {
        println!("   ℹ️  Target directory not found, skipping.");
    }

    // 3. Clean Cargo Lock (optional, sometimes good for deep clean)
    let lock_file = Path::new("omnic/Cargo.lock");
    if lock_file.exists() {
        println!("   🔓 Removing Cargo.lock...");
        let _ = fs::remove_file(lock_file);
    }

    // 4. Force Cargo Clean
    println!("   🧹 Running cargo clean...");
    let status = Command::new("cargo")
        .args(["clean", "--manifest-path", "omnic/Cargo.toml"])
        .status();

    match status {
        Ok(s) if s.success() => println!("   ✨ Cargo clean successful."),
        _ => println!("   {} Cargo clean reported errors (might be due to missing files, ignored).", "⚠️".yellow()),
    }

    println!("\n{}", "✅ Repair Complete. Allocations released.".green().bold());
    println!("   Run 'omni.bat' or 'cargo build' to rebuild.");

    Ok(())
}
