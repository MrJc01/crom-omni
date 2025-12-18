use std::fs::{self, File};
use std::io::{Write, Read, Seek};
use std::path::Path;
use anyhow::{Result, Context};
use zip::write::FileOptions;
#[cfg(unix)]
use std::os::unix::fs::PermissionsExt; // Para chmod (apenas Unix)

/// Cria um executável compactado (ZipApp)
/// Adiciona um shebang header + uncompressed/compressed zip
pub fn create_bundle(source_dir: &Path, output_file: &Path, shebang: &str) -> Result<()> {
    // 1. Criar o arquivo de saída
    let file = File::create(output_file)
        .with_context(|| format!("Falha ao criar arquivo de bundle: {}", output_file.display()))?;
    
    // 2. Escrever Shebang Header
    // Ex: #!/usr/bin/env python3
    let mut writer = std::io::BufWriter::new(file);
    writer.write_all(shebang.as_bytes())?;
    writer.write_all(b"\n")?;

    // 3. Iniciar Zip Writer no mesmo arquivo (append)
    let mut zip = zip::ZipWriter::new(writer);
    let options = FileOptions::default()
        .compression_method(zip::CompressionMethod::Stored) // Stored é mais rápido e compatível. Deflated tbm funciona.
        .unix_permissions(0o755);

    // 4. Adicionar arquivos recursivamente
    add_dir_to_zip(&mut zip, source_dir, source_dir, options)?;

    // 5. Finalizar
    zip.finish()?;
    
    // 6. Tornar executável (Unix only feature, no Windows não faz nada mas Rust std lida bem)
    #[cfg(unix)]
    {
        let mut perms = fs::metadata(output_file)?.permissions();
        perms.set_mode(0o755);
        fs::set_permissions(output_file, perms)?;
    }

    Ok(())
}

fn add_dir_to_zip<W: Write + Seek>(
    zip: &mut zip::ZipWriter<W>,
    base_dir: &Path,
    current_dir: &Path,
    options: FileOptions,
) -> Result<()> {
    let entries = fs::read_dir(current_dir)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        
        // Caminho relativo dentro do zip
        let name = path.strip_prefix(base_dir)?.to_str().unwrap().replace("\\", "/");

        if path.is_dir() {
            zip.add_directory(&name, options)?;
            add_dir_to_zip(zip, base_dir, &path, options)?;
        } else {
            zip.start_file(&name, options)?;
            let mut f = File::open(&path)?;
            std::io::copy(&mut f, zip)?;
        }
    }

    Ok(())
}
