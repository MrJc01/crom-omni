//! Laravel Generator - Laravel PHP Generation
//!
//! Generates Laravel Controllers, Models, and Migrations.

use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// Laravel model field
#[derive(Debug, Clone)]
pub struct ModelField {
    pub name: String,
    pub field_type: String,
    pub nullable: bool,
    pub fillable: bool,
}

/// Laravel model
#[derive(Debug, Clone)]
pub struct LaravelModel {
    pub name: String,
    pub table_name: String,
    pub fields: Vec<ModelField>,
    pub timestamps: bool,
}

impl LaravelModel {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            table_name: pluralize(&name.to_lowercase()),
            fields: Vec::new(),
            timestamps: true,
        }
    }

    /// Generate Model PHP code
    pub fn to_model(&self) -> String {
        let fillable: Vec<_> = self.fields.iter()
            .filter(|f| f.fillable)
            .map(|f| format!("'{}'", f.name))
            .collect();

        format!(r#"<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class {} extends Model
{{
    use HasFactory;

    protected $table = '{}';

    protected $fillable = [
        {}
    ];
}}
"#,
            self.name,
            self.table_name,
            fillable.join(",\n        ")
        )
    }

    /// Generate Controller PHP code
    pub fn to_controller(&self) -> String {
        let var_name = self.name.to_lowercase();
        
        format!(r#"<?php

namespace App\Http\Controllers;

use App\Models\{name};
use Illuminate\Http\Request;

class {name}Controller extends Controller
{{
    public function index()
    {{
        ${var}s = {name}::all();
        return view('{var}s.index', compact('{var}s'));
    }}

    public function show({name} ${var})
    {{
        return view('{var}s.show', compact('{var}'));
    }}

    public function store(Request $request)
    {{
        ${var} = {name}::create($request->validated());
        return redirect()->route('{var}s.show', ${var});
    }}

    public function update(Request $request, {name} ${var})
    {{
        ${var}->update($request->validated());
        return redirect()->route('{var}s.show', ${var});
    }}

    public function destroy({name} ${var})
    {{
        ${var}->delete();
        return redirect()->route('{var}s.index');
    }}
}}
"#,
            name = self.name,
            var = var_name
        )
    }

    /// Generate Migration PHP code
    pub fn to_migration(&self) -> String {
        let mut columns = String::new();
        
        for field in &self.fields {
            let col_type = match field.field_type.as_str() {
                "Int" | "i32" => "integer",
                "i64" => "bigInteger",
                "String" => "string",
                "Text" => "text",
                "Bool" => "boolean",
                "Float" => "float",
                "Date" => "date",
                "DateTime" => "dateTime",
                _ => "string",
            };
            
            let nullable = if field.nullable { "->nullable()" } else { "" };
            columns.push_str(&format!(
                "            $table->{}('{}'){};\n",
                col_type, field.name, nullable
            ));
        }

        format!(r#"<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{{
    public function up(): void
    {{
        Schema::create('{}', function (Blueprint $table) {{
            $table->id();
{}            $table->timestamps();
        }});
    }}

    public function down(): void
    {{
        Schema::dropIfExists('{}');
    }}
}};
"#,
            self.table_name,
            columns,
            self.table_name
        )
    }
}

fn pluralize(s: &str) -> String {
    if s.ends_with('s') {
        format!("{}es", s)
    } else if s.ends_with('y') {
        format!("{}ies", &s[..s.len()-1])
    } else {
        format!("{}s", s)
    }
}

/// Extract Laravel models from Omni code
pub fn extract_from_omni(code: &str) -> Vec<LaravelModel> {
    let mut models = Vec::new();
    let mut current: Option<LaravelModel> = None;

    for line in code.lines() {
        let trimmed = line.trim();

        if trimmed.starts_with("struct ") {
            if let Some(model) = current.take() {
                models.push(model);
            }

            let name = trimmed[7..].split('{').next()
                .unwrap_or("Model")
                .trim()
                .to_string();

            current = Some(LaravelModel::new(&name));
        }

        if let Some(ref mut model) = current {
            if trimmed.contains(':') && !trimmed.starts_with("struct") && !trimmed.starts_with("fn") {
                let parts: Vec<&str> = trimmed.split(':').collect();
                if parts.len() >= 2 {
                    let name = parts[0].trim().to_string();
                    let field_type = parts[1].trim().trim_end_matches(',').to_string();

                    model.fields.push(ModelField {
                        name: name.clone(),
                        field_type,
                        nullable: parts[1].contains('?'),
                        fillable: name != "id",
                    });
                }
            }
        }

        if trimmed == "}" {
            if let Some(model) = current.take() {
                if !model.fields.is_empty() {
                    models.push(model);
                }
            }
        }
    }

    models
}

/// Generate Laravel files from Omni code
pub fn generate_laravel(code: &str, output_dir: &Path) -> Result<()> {
    println!("{}", "🔶 Generating Laravel files...".cyan().bold());

    let models = extract_from_omni(code);
    
    // Create directories
    let models_dir = output_dir.join("app/Models");
    let controllers_dir = output_dir.join("app/Http/Controllers");
    let migrations_dir = output_dir.join("database/migrations");
    
    fs::create_dir_all(&models_dir)?;
    fs::create_dir_all(&controllers_dir)?;
    fs::create_dir_all(&migrations_dir)?;

    for model in &models {
        // Model
        let model_file = models_dir.join(format!("{}.php", model.name));
        fs::write(&model_file, model.to_model())?;
        println!("  {} Models/{}.php", "✓".green(), model.name);

        // Controller
        let ctrl_file = controllers_dir.join(format!("{}Controller.php", model.name));
        fs::write(&ctrl_file, model.to_controller())?;
        println!("  {} Controllers/{}Controller.php", "✓".green(), model.name);

        // Migration
        let migration_file = migrations_dir.join(format!(
            "2024_01_01_000000_create_{}_table.php",
            model.table_name
        ));
        fs::write(&migration_file, model.to_migration())?;
        println!("  {} migrations/create_{}_table.php", "✓".green(), model.table_name);
    }

    println!("{} Generated {} models with controllers and migrations", 
        "✓".green(), models.len());

    Ok(())
}
