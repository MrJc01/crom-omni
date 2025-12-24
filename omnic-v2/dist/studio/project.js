BlockLoop: 61 (let)
BlockLoop: 80 (native)
BlockLoop: 66 (return)
class ProjectInfo {
    constructor(data = {}) {
        this.name = data.name;
        this.type = data.type;
        this.config_file = data.config_file;
        this.run_command = data.run_command;
        this.build_command = data.build_command;
        this.dev_command = data.dev_command;
    }
}
function detect_project(dir) {
    const info = new ProjectInfo({ name: "", type: "unknown", config_file: "", run_command: "", build_command: "", dev_command: "" });
    
        const fs = require('fs');
        const path = require('path');
        
        info.name = path.basename(dir);
        
        // Detection order (most specific first)
        const detectors = [
            {
                file: 'omni.config.json',
                type: 'omni',
                run: 'omni run main.omni',
                build: 'omni build',
                dev: 'omni studio'
            },
            {
                file: 'package.json',
                type: 'node',
                run: 'npm start',
                build: 'npm run build',
                dev: 'npm run dev'
            },
            {
                file: 'Cargo.toml',
                type: 'rust',
                run: 'cargo run',
                build: 'cargo build --release',
                dev: 'cargo watch -x run'
            },
            {
                file: 'composer.json',
                type: 'php',
                run: 'php artisan serve',
                build: 'composer install',
                dev: 'php artisan serve'
            },
            {
                file: 'requirements.txt',
                type: 'python',
                run: 'python main.py',
                build: 'pip install -r requirements.txt',
                dev: 'uvicorn app:main --reload'
            },
            {
                file: 'pyproject.toml',
                type: 'python',
                run: 'python -m app',
                build: 'pip install -e .',
                dev: 'uvicorn app:main --reload'
            },
            {
                file: 'go.mod',
                type: 'go',
                run: 'go run .',
                build: 'go build',
                dev: 'go run .'
            },
            {
                file: 'pom.xml',
                type: 'java',
                run: './mvnw spring-boot:run',
                build: './mvnw package',
                dev: './mvnw spring-boot:run'
            },
            {
                file: 'build.gradle',
                type: 'java',
                run: './gradlew bootRun',
                build: './gradlew build',
                dev: './gradlew bootRun'
            },
            {
                file: 'artisan',
                type: 'laravel',
                run: 'php artisan serve',
                build: 'composer install && npm run build',
                dev: 'php artisan serve'
            }
        ];
        
        for (const detector of detectors) {
            const configPath = path.join(dir, detector.file);
            if (fs.existsSync(configPath)) {
                info.type = detector.type;
                info.config_file = detector.file;
                info.run_command = detector.run;
                info.build_command = detector.build;
                info.dev_command = detector.dev;
                break;
            }
        }
    
    return info;
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.detect_project = detect_project;
    exports.ProjectInfo = ProjectInfo;
}
