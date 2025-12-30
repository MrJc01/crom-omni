use anyhow::Result;
use std::path::PathBuf;
use crate::core::config::OmniConfig;

pub trait FrameworkAdapter {
    fn name(&self) -> &str;
    fn scaffold(&self, output_dir: &PathBuf, config: &OmniConfig) -> Result<()>;
}

pub struct LaravelAdapter;

impl FrameworkAdapter for LaravelAdapter {
    fn name(&self) -> &str {
        "laravel"
    }

    fn scaffold(&self, output_dir: &PathBuf, config: &OmniConfig) -> Result<()> {
        let project_name = if config.project.name.is_empty() {
            "omni_app".to_string()
        } else {
            config.project.name.clone()
        };
        
        println!("   🐘 Scaffolding Laravel Project: {}", project_name);
        
        // Create app directory
        let app_dir = output_dir.join("app");
        std::fs::create_dir_all(&app_dir)?;
        
        // Create routes with CRUD endpoints
        let routes_file = output_dir.join("routes/web.php");
        if let Some(parent) = routes_file.parent() {
            std::fs::create_dir_all(parent)?;
        }
        std::fs::write(&routes_file, r#"<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('welcome');
});

// User CRUD Routes
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
"#)?;

        // Create UserController with CRUD methods
        let controller_path = output_dir.join("app/Http/Controllers/UserController.php");
        if let Some(parent) = controller_path.parent() {
             std::fs::create_dir_all(parent)?;
        }
        std::fs::write(&controller_path, r#"<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $user = User::create($request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]));
        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$id,
        ]));
        return response()->json($user);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
"#)?;

        // Create User migration with proper fields (id, name, email)
        let migration_path = output_dir.join("database/migrations/2024_01_01_000000_create_users_table.php");
        if let Some(parent) = migration_path.parent() {
             std::fs::create_dir_all(parent)?;
        }
        std::fs::write(&migration_path, r#"<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
"#)?;
        
        println!("   ✅ Laravel structure created at {}", output_dir.display());
        Ok(())
    }
}

