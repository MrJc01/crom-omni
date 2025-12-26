//! SQL Generator - Dialect-Agnostic SQL Generation
//!
//! Generates SQL for different database dialects.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use anyhow::Result;
use colored::*;

/// SQL dialect
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SqlDialect {
    Mysql,
    Postgres,
    Sqlite,
    Sqlserver,
}

impl SqlDialect {
    pub fn name(&self) -> &'static str {
        match self {
            SqlDialect::Mysql => "MySQL",
            SqlDialect::Postgres => "PostgreSQL",
            SqlDialect::Sqlite => "SQLite",
            SqlDialect::Sqlserver => "SQL Server",
        }
    }
}

/// Column type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ColumnType {
    Int,
    BigInt,
    Float,
    Double,
    Varchar(usize),
    Text,
    Boolean,
    Date,
    DateTime,
    Timestamp,
    Json,
    Uuid,
}

impl ColumnType {
    pub fn to_sql(&self, dialect: SqlDialect) -> String {
        match (self, dialect) {
            (ColumnType::Int, _) => "INT".to_string(),
            (ColumnType::BigInt, _) => "BIGINT".to_string(),
            (ColumnType::Float, _) => "FLOAT".to_string(),
            (ColumnType::Double, _) => "DOUBLE".to_string(),
            (ColumnType::Varchar(n), _) => format!("VARCHAR({})", n),
            (ColumnType::Text, _) => "TEXT".to_string(),
            (ColumnType::Boolean, SqlDialect::Mysql) => "TINYINT(1)".to_string(),
            (ColumnType::Boolean, _) => "BOOLEAN".to_string(),
            (ColumnType::Date, _) => "DATE".to_string(),
            (ColumnType::DateTime, _) => "DATETIME".to_string(),
            (ColumnType::Timestamp, _) => "TIMESTAMP".to_string(),
            (ColumnType::Json, SqlDialect::Mysql) => "JSON".to_string(),
            (ColumnType::Json, SqlDialect::Postgres) => "JSONB".to_string(),
            (ColumnType::Json, _) => "TEXT".to_string(),
            (ColumnType::Uuid, SqlDialect::Postgres) => "UUID".to_string(),
            (ColumnType::Uuid, _) => "VARCHAR(36)".to_string(),
        }
    }
}

/// Column definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Column {
    pub name: String,
    pub col_type: ColumnType,
    pub nullable: bool,
    pub primary_key: bool,
    pub auto_increment: bool,
    pub default: Option<String>,
}

/// Table definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Table {
    pub name: String,
    pub columns: Vec<Column>,
}

impl Table {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            columns: Vec::new(),
        }
    }

    pub fn add_column(&mut self, column: Column) {
        self.columns.push(column);
    }

    /// Generate CREATE TABLE SQL
    pub fn to_create_sql(&self, dialect: SqlDialect) -> String {
        let mut sql = format!("CREATE TABLE {} (\n", self.name);
        
        let col_defs: Vec<String> = self.columns.iter().map(|col| {
            let mut def = format!("    {} {}", col.name, col.col_type.to_sql(dialect));
            
            if col.primary_key {
                def.push_str(" PRIMARY KEY");
            }
            if col.auto_increment {
                match dialect {
                    SqlDialect::Mysql => def.push_str(" AUTO_INCREMENT"),
                    SqlDialect::Postgres => {
                        def = format!("    {} SERIAL PRIMARY KEY", col.name);
                    }
                    SqlDialect::Sqlite => def.push_str(" AUTOINCREMENT"),
                    SqlDialect::Sqlserver => def.push_str(" IDENTITY(1,1)"),
                }
            }
            if !col.nullable && !col.primary_key {
                def.push_str(" NOT NULL");
            }
            if let Some(ref default) = col.default {
                def.push_str(&format!(" DEFAULT {}", default));
            }
            
            def
        }).collect();
        
        sql.push_str(&col_defs.join(",\n"));
        sql.push_str("\n);\n");
        
        sql
    }
}

/// Schema definition
#[derive(Debug, Clone, Default)]
pub struct Schema {
    pub tables: Vec<Table>,
}

impl Schema {
    pub fn new() -> Self {
        Self { tables: Vec::new() }
    }

    pub fn add_table(&mut self, table: Table) {
        self.tables.push(table);
    }

    /// Generate migration SQL
    pub fn to_migration(&self, dialect: SqlDialect) -> String {
        let mut sql = String::new();
        
        sql.push_str(&format!("-- Generated for {}\n", dialect.name()));
        sql.push_str(&format!("-- Generated at {}\n\n", chrono_now()));
        
        for table in &self.tables {
            sql.push_str(&table.to_create_sql(dialect));
            sql.push('\n');
        }
        
        sql
    }
}

fn chrono_now() -> String {
    "2024-01-01 00:00:00".to_string() // Placeholder
}

/// Extract schema from Omni code
pub fn extract_from_omni(code: &str) -> Schema {
    let mut schema = Schema::new();
    let mut current_table: Option<Table> = None;
    
    for line in code.lines() {
        let trimmed = line.trim();
        
        // Look for @table or struct
        if trimmed.starts_with("@table") || trimmed.contains("@entity") {
            // Next struct is a table
        }
        
        if trimmed.starts_with("struct ") {
            if let Some(table) = current_table.take() {
                schema.add_table(table);
            }
            
            let name = trimmed[7..].split('{').next()
                .unwrap_or("unknown")
                .trim()
                .to_string();
            
            current_table = Some(Table::new(&name));
        }
        
        // Extract fields as columns
        if let Some(ref mut table) = current_table {
            if trimmed.contains(':') && !trimmed.starts_with("struct") && !trimmed.starts_with("fn") {
                let parts: Vec<&str> = trimmed.split(':').collect();
                if parts.len() >= 2 {
                    let name = parts[0].trim().to_string();
                    let type_str = parts[1].trim().trim_end_matches(',');
                    
                    let col_type = match type_str {
                        "Int" | "i32" => ColumnType::Int,
                        "i64" => ColumnType::BigInt,
                        "Float" | "f32" => ColumnType::Float,
                        "f64" => ColumnType::Double,
                        "String" => ColumnType::Varchar(255),
                        "Bool" => ColumnType::Boolean,
                        _ => ColumnType::Text,
                    };
                    
                    let is_id = name == "id";
                    table.add_column(Column {
                        name,
                        col_type,
                        nullable: type_str.contains('?'),
                        primary_key: is_id,
                        auto_increment: is_id,
                        default: None,
                    });
                }
            }
        }
        
        if trimmed == "}" {
            if let Some(table) = current_table.take() {
                if !table.columns.is_empty() {
                    schema.add_table(table);
                }
            }
        }
    }
    
    schema
}

/// Generate SQL from Omni code
pub fn generate_sql(code: &str, dialect: SqlDialect, output: &Path) -> Result<()> {
    println!("{}", format!("🗄️ Generating {} SQL...", dialect.name()).cyan().bold());
    
    let schema = extract_from_omni(code);
    let sql = schema.to_migration(dialect);
    
    fs::write(output, &sql)?;
    
    println!("{} Generated {} tables", "✓".green(), schema.tables.len());
    println!("{} Saved to {}", "✓".green(), output.display());
    
    Ok(())
}
