module.exports = {
            // PHP Patterns
            php: [
                { 
                    name: 'class_definition',
                    regex: /class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?\s*\{/,
                    toOmni: (m) => `struct ${m[1]} {\n    // TODO: Extract fields\n}`
                },
                {
                    name: 'function_definition',
                    regex: /function\s+(\w+)\s*\((.*?)\)(?:\s*:\s*(\w+))?\s*\{/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) ${m[3] ? '-> ' + m[3] : ''} {\n    // TODO: Extract body\n}`
                },
                {
                    name: 'public_method',
                    regex: /public\s+function\s+(\w+)\s*\((.*?)\)/,
                    toOmni: (m) => `fn ${m[1]}(self: Self${m[2] ? ', ' + m[2] : ''})`
                },
                {
                    name: 'eloquent_model',
                    regex: /class\s+(\w+)\s+extends\s+Model/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                },
                {
                    name: 'controller',
                    regex: /class\s+(\w+)Controller\s+extends\s+Controller/,
                    toOmni: (m) => `@server\ncapsule ${m[1]} {\n    // TODO: Extract flows\n}`
                },
                {
                    name: 'route_get',
                    regex: /Route::get\(['"]([^'"]+)['"]\s*,\s*\[(\w+)::class,\s*['"](\w+)['"]\]/,
                    toOmni: (m) => `@server.get("${m[1]}")\nflow ${m[3]}()`
                },
                {
                    name: 'route_post',
                    regex: /Route::post\(['"]([^'"]+)['"]\s*,\s*\[(\w+)::class,\s*['"](\w+)['"]\]/,
                    toOmni: (m) => `@server.post("${m[1]}")\nflow ${m[3]}()`
                }
            ],
            
            // Java Patterns
            java: [
                {
                    name: 'class_definition',
                    regex: /(?:public\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?\s*\{/,
                    toOmni: (m) => `struct ${m[1]} {\n    // TODO: Extract fields\n}`
                },
                {
                    name: 'method_definition',
                    regex: /(?:public|private|protected)?\s*(?:static\s+)?(\w+)\s+(\w+)\s*\((.*?)\)\s*(?:throws\s+\w+)?\s*\{/,
                    toOmni: (m) => `fn ${m[2]}(${m[3] || ''}) -> ${m[1]} {\n}`
                },
                {
                    name: 'spring_controller',
                    regex: /@(?:RestController|Controller)[\s\S]*?class\s+(\w+)/,
                    toOmni: (m) => `@server\ncapsule ${m[1]} {\n}`
                },
                {
                    name: 'spring_get',
                    regex: /@GetMapping\(['"]([^'"]+)['"]\)[\s\S]*?(?:public\s+)?(\w+)\s+(\w+)/,
                    toOmni: (m) => `@server.get("${m[1]}")\nflow ${m[3]}() -> ${m[2]}`
                },
                {
                    name: 'spring_entity',
                    regex: /@Entity[\s\S]*?class\s+(\w+)/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                },
                {
                    name: 'spring_repository',
                    regex: /interface\s+(\w+)Repository\s+extends\s+(?:JpaRepository|CrudRepository)/,
                    toOmni: (m) => `// Repository ${m[1]} -> Omni @entity auto-generates CRUD`
                }
            ],
            
            // JavaScript/TypeScript Patterns
            javascript: [
                {
                    name: 'class_definition',
                    regex: /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/,
                    toOmni: (m) => `struct ${m[1]} {\n}`
                },
                {
                    name: 'function_definition',
                    regex: /(?:async\s+)?function\s+(\w+)\s*\((.*?)\)(?:\s*:\s*(\w+))?\s*\{/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) ${m[3] ? '-> ' + m[3] : ''} {\n}`
                },
                {
                    name: 'arrow_function',
                    regex: /const\s+(\w+)\s*=\s*(?:async\s+)?\((.*?)\)\s*=>/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) {\n}`
                },
                {
                    name: 'express_route',
                    regex: /(?:app|router)\.(get|post|put|delete)\(['"]([^'"]+)['"]/,
                    toOmni: (m) => `@server.${m[1]}("${m[2]}")\nflow handler()`
                },
                {
                    name: 'nextjs_api',
                    regex: /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE)/,
                    toOmni: (m) => `@server.${m[1].toLowerCase()}("/")\nflow handler()`
                },
                {
                    name: 'react_component',
                    regex: /(?:export\s+)?(?:default\s+)?function\s+(\w+)\s*\(\s*(?:\{[^}]*\}|props)?\s*\)/,
                    toOmni: (m) => `@ui.component\nfn ${m[1]}() {\n}`
                }
            ],
            
            // Python Patterns
            python: [
                {
                    name: 'class_definition',
                    regex: /class\s+(\w+)(?:\((\w+)\))?:/,
                    toOmni: (m) => `struct ${m[1]} {\n}`
                },
                {
                    name: 'function_definition',
                    regex: /def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*(\w+))?:/,
                    toOmni: (m) => `fn ${m[1]}(${m[2] || ''}) ${m[3] ? '-> ' + m[3] : ''} {\n}`
                },
                {
                    name: 'fastapi_get',
                    regex: /@app\.get\(['"]([^'"]+)['"]\)[\s\S]*?(?:async\s+)?def\s+(\w+)/,
                    toOmni: (m) => `@server.get("${m[1]}")\nflow ${m[2]}()`
                },
                {
                    name: 'django_model',
                    regex: /class\s+(\w+)\(models\.Model\):/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                },
                {
                    name: 'sqlalchemy_model',
                    regex: /class\s+(\w+)\(Base\):/,
                    toOmni: (m) => `@entity\nstruct ${m[1]} {\n    id: i64\n}`
                }
            ]
        };
