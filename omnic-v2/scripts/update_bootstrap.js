const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Cores para Logs
const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

// Configuração de Compilação
// Mapeia onde está o código Omni (Source) e onde será gerado o JS (Dest)
const tasks = [
  { src: "src/core/token.omni", dest: "bootstrap/core/token.js" },
  { src: "src/core/lexer.omni", dest: "bootstrap/core/lexer.js" },
  { src: "src/core/ast.omni", dest: "bootstrap/core/ast.js" },
  { src: "src/core/parser.omni", dest: "bootstrap/core/parser.js" },
  { src: "src/core/codegen.omni", dest: "bootstrap/core/codegen.js" },
  { src: "src/core/io.omni", dest: "bootstrap/core/io.js" },
  { src: "src/main.omni", dest: "bootstrap/main.js" },
];

function bootstrap() {
  console.log(
    `${BLUE}=== 🚀 Iniciando Bootstrapping do Omni (Geração 3) ===${RESET}\n`
  );

  // 1. Criar Estrutura de Pastas
  if (!fs.existsSync("bootstrap")) fs.mkdirSync("bootstrap");
  if (!fs.existsSync("bootstrap/core")) fs.mkdirSync("bootstrap/core");

  // 2. Compilar Cada Arquivo
  for (const task of tasks) {
    const cmd = `node dist/main.js ${task.src} ${task.dest}`;
    try {
      process.stdout.write(
        `Compilando ${path.basename(task.src).padEnd(20)} -> `
      );
      // Executa o compilador v2 (dist/main.js)
      execSync(cmd, { stdio: "pipe" });
      console.log(`${GREEN}[OK]${RESET}`);
    } catch (e) {
      console.log(`${RED}[ERRO]${RESET}`);
      console.error(`Falha ao executar: ${cmd}`);
      console.error(e.stderr ? e.stderr.toString() : e.message);
      process.exit(1);
    }
  }

  // 3. Aplicar Patches (O "Glue Code" do Node.js)
  console.log(`\n${BLUE}=== 🔧 Aplicando Patches de Runtime ===${RESET}`);

  for (const task of tasks) {
    const filePath = task.dest;
    let content = fs.readFileSync(filePath, "utf8");
    const fileName = path.basename(filePath);

    // --- Lógica de Auto-Export ---
    
    // Patch: Converte const para let em variáveis locais (lowercase) para permitir reatribuição
    // Isso corrige o comportamento do compilador V2 que gera 'const' para tudo
    // Regex ajustada para aceitar indentação
    content = content.replace(/const\s+([a-z][a-zA-Z0-9_]*)\s*=/g, 'let $1 =');

    // Varre o código gerado em busca de Classes, Funções e Constantes globais
    // e as adiciona ao module.exports e ao escopo global (simulando o ambiente Omni)
    const exportList = [];

    // 1. Captura Classes (ex: class Token {...})
    const classMatches = [...content.matchAll(/class\s+([a-zA-Z0-9_]+)/g)];
    classMatches.forEach((m) => exportList.push(m[1]));

    // 2. Captura Funções (ex: function parse_program(...) {...})
    const funcMatches = [...content.matchAll(/function\s+([a-zA-Z0-9_]+)/g)];
    funcMatches.forEach((m) => exportList.push(m[1]));

    // 3. Captura Constantes (ex: const TOKEN_EOF = ...)
    // Filtramos para evitar variáveis locais, exigindo que estejam no início da linha
    const constMatches = [...content.matchAll(/^const\s+([a-zA-Z0-9_]+)\s*=/gm)];
    constMatches.forEach((m) => exportList.push(m[1]));

    // Remove duplicatas
    const uniqueExports = [...new Set(exportList)];

    // Injeta o rodapé mágico
    const footer = `
// --- [Bootstrap Auto-Patch] ---
// Exporta símbolos para require()
module.exports = { ${uniqueExports.join(", ")} };

// Injeta no Global para simular o namespace plano do Omni
Object.assign(global, module.exports);
`;
    content += footer;

    // --- Patches Específicos para main.js ---
    if (fileName === "main.js") {
      // Injeta helpers que o main.omni espera nativamente
      const header = `
const fs = require('fs');
// Define print() globalmente
global.print = function(msg) { console.log(msg); };
`;
      content = header + content;

      // Adiciona gatilho de execução no final
      content += `\nif (typeof main === 'function') main();\n`;
    }

    // Salva o arquivo corrigido
    fs.writeFileSync(filePath, content);
    console.log(`Patched: ${fileName}`);
  }

  console.log(
    `\n${GREEN}=== ✨ Bootstrap Completo! O Compilador Geração 3 está vivo. ===${RESET}`
  );
  console.log(`\nTeste o novo compilador com:`);
  console.log(`${BLUE}node bootstrap/main.js teste_io.omni${RESET}`);
}

bootstrap();
