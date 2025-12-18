# Omni Platform 🪐

> **Soberania da Lógica. Fluidez da Arquitetura. Universalidade da Execução.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-v0.1.0--alpha-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

O **Omni** é uma plataforma de engenharia de software desenhada para dissociar a **Lógica de Negócios** da **Infraestrutura**. Escreva sua lógica uma vez e compile-a para Monolitos, Microserviços, Scripts Python, Apps Node.js ou Executáveis Universais.

## 🚀 O Que Nós Construímos (MVP)

Atualmente, o compilador `omnic` (escrito em Rust) é capaz de:

1.  **Lexing & Parsing (A+C Syntax):** Entende uma sintaxe moderna e segura (mistura de Rust e C).
2.  **Transpilação Poliglota:** Gera código nativo para **JavaScript (Node.js)** e **Python**.
3.  **Metamorfose via Config:** Um único arquivo `omni.config.json` controla se o output é um script solto ou um projeto estruturado.
4.  **Universal Packaging (`.run`):** Empacota o código e o runtime num arquivo único executável (ZipApp) que roda em Linux/Mac/Windows (via Python runtime).

## 📦 Instalação

Como o projeto está em Alpha, você deve compilar o código fonte:

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/crom-omni.git](https://github.com/seu-usuario/crom-omni.git)
cd crom-omni/omnic

# Compile e instale (Requer Rust/Cargo)
cargo install --path .
```

````

## 🛠️ Como Usar

### 1. O "Hello World"

Crie um arquivo `hello.omni`:

```rust
fn main() {
    print("Olá, Omni! A lógica é líquida.");
    let ano = 2025;
    if (ano >= 2025) {
        print("O futuro chegou.");
    }
}

```

Compile e rode instantaneamente:

```bash
omnic build hello.omni --target python
# Gera: dist/hello.py

```

### 2. O Modo Projeto (Power User)

Para projetos reais, use o `omni.config.json`.

```json
{
  "project": { "name": "SistemaSolar", "version": "1.0" },
  "targets": {
    "servidor": {
      "format": "python",
      "output": "dist/bin",
      "source": "src/main.omni",
      "bundle": true
    }
  }
}
```

Rode o build:

```bash
omnic build

```

Isso gerará um arquivo executável:

```bash
./dist/bin/servidor.run
# Saída: "Olá, Omni!..."

```

## 🏗️ Arquitetura

O Omni opera em 4 estágios:

1. **Source:** Código `.omni` (Lógica Pura).
2. **AST:** Árvore de Sintaxe Abstrata (Representação Matemática).
3. **CodeGen:** Tradução para linguagens alvo (JS, Python, C++, etc.).
4. **Packager:** Criação de artefatos distribuíveis (`.run`, Docker, etc.).

## 🔮 Roadmap

- [x] MVP Compiler (Rust)
- [x] Backend JS & Python
- [x] Empacotador `.run`
- [ ] **Omni Ingest:** Camada de IA para importar código legado.
- [ ] **Standard Library:** Interfaces canônicas para HTTP e Banco de Dados.
- [ ] **LSP:** Extensão para VS Code com autocomplete.

---

_Criado com Lógica Líquida._
````
