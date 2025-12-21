# Omni Platform

> **Soberania da Lógica. Fluidez da Arquitetura. Universalidade da Execução.**

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/crom-omni.git
cd crom-omni/omnic-v2

# Install globally
node dist/main.js setup
```

### Basic Usage

```bash
# Execute instantly via VM (no compilation)
omni run app.omni

# Compile to JavaScript
omni app.omni app.js

# Compile to Python
omni app.omni app.py --target python

# Generate Next.js project
omni app.omni dist/ --framework nextjs

# Generate Laravel project
omni app.omni dist/ --framework laravel

# Show version
omni --version
```

### Hello World

```omni
fn main() {
    print("Hello, Omni!");
}
```

```bash
omni run hello.omni
# Output: Hello, Omni!
```

---

## O Manifesto Omni

### O Problema: A Torre de Babel Digital

A engenharia de software tornou-se refém de suas próprias ferramentas. Estamos presos em silos. Escrevemos a mesma lógica de negócios repetidamente: uma vez para o Backend (Java/Go), uma vez para o Frontend (TS/React), e outra para o Mobile (Swift/Kotlin). Somos forçados a tomar decisões arquiteturais irreversíveis no "Dia 1": Monolito ou Microserviços? SQL ou NoSQL? Nuvem ou Local? Passamos mais tempo configurando ambientes, brigando com dependências e traduzindo paradigmas do que resolvendo problemas reais.

O código tornou-se estático, pesado e perecível. Nós declaramos que isso deve acabar.

### A Nossa Visão: Lógica Líquida

Acreditamos em um futuro onde o código é **Lógica Pura**, dissociada da infraestrutura que a executa. O Omni não é apenas uma linguagem; é um veículo de metamorfose. O código que você escreve hoje como um script local deve ser capaz de se desdobrar, amanhã, em um ecossistema de microsserviços globais, sem que uma única linha de lógica precise ser reescrita.

---

## Os 5 Pilares da Omni

### 1. Intenção sobre Implementação

O programador deve declarar **O QUE** deseja fazer, não **COMO** o computador deve executar.

- **Nós escrevemos:** "Salvar este dado".
- **O Omni decide:** Se será num arquivo `.txt`, num banco SQLite, ou num cluster S3 na AWS, baseado na configuração do momento. A complexidade da implementação é delegada aos **Blueprints**, não _hardcoded_ na lógica.

### 2. Metamorfose Arquitetural

A arquitetura de um software não deve ser uma fundação de concreto, mas um **exoesqueleto intercambiável**. Um sistema Omni nasce sem forma definida. Ele se adapta ao ambiente. Ele pode ser compilado como um binário nativo de alta performance (C/Rust), um script dinâmico (Python/JS) ou um executável universal (`.run`). A topologia do sistema (Monolito vs. Distribuído) é uma escolha de _deploy_, não de desenvolvimento.

### 3. O Núcleo Oco e a Comunidade Soberana

Rejeitamos a "Standard Library" inchada que envelhece mal. O Omni possui um **Core Oco** (_Hollow Core_). A linguagem fornece as **Interfaces Canônicas** (os contratos), mas a comunidade fornece as implementações. Isso garante que o Omni nunca se torne obsoleto. Se a tecnologia muda, trocamos a biblioteca, mas mantemos a linguagem.

- **Túnel Nativo:** Quando a abstração não for suficiente, descemos ao metal. Não há barreiras, apenas pontes.

### 4. Observabilidade como Direito, não Recurso

Um sistema que não pode ser depurado é um sistema quebrado. No Omni, o **Flight Recorder** (Caixa Preta) e a visualização de fluxo não são plugins; são o padrão. A execução é transparente, auditável e visível desde o primeiro "Hello World". Testar não é uma etapa posterior; é o estado natural da execução.

### 5. O Passado é Combustível (Ingestão por Mapeamento Semântico)

Não acreditamos em deixar ninguém para trás. O código legado do mundo — em COBOL, Java, PHP ou C++ — não é lixo; é conhecimento cristalizado. Através do **Motor de Mapeamento Semântico e AST**, o Omni transforma sistemas legados em lógica moderna. Nós não apenas reescrevemos; nós libertamos a lógica antiga das amarras de suas linguagens mortas.

---

## O Tradutor Universal de Lógica

O Omni é o **Tradutor Universal de Lógica**. Não geramos código; **mapeamos grafos de AST** entre linguagens usando regras de equivalência determinísticas:

```
   Código Legado          Omni IR            Código Alvo
   ┌──────────┐       ┌───────────┐       ┌──────────┐
   │  Java    │──────▶│   AST     │──────▶│  Python  │
   │  PHP     │  AST  │  Canônica │ Rules │  JS/TS   │
   │  C#      │──────▶│  Omni     │──────▶│  Rust    │
   └──────────┘       └───────────┘       └──────────┘
```

---

## Ponte de Frameworks

O Omni suporta **Blueprints de Tradução de Interfaces** para trocar frameworks com uma linha de configuração:

```json
{
  "ui_framework": "react", // ou "vue", "svelte", "htmx"
  "backend_framework": "fastapi", // ou "express", "laravel", "gin"
  "orm": "sqlalchemy" // ou "sequelize", "eloquent", "diesel"
}
```

A mesma lógica `@ui` gera componentes React, Vue ou Svelte automaticamente.

Veja [ADAPTERS_SYSTEM.md](./ADAPTERS_SYSTEM.md) para documentação completa do sistema de Adapters.

---

## O Compromisso

Nós construímos o Omni para ser a última camada de abstração que você precisará aprender.

- **Para o Iniciante:** A simplicidade de um script.
- **Para o Expert:** O poder do controle de memória e hardware.
- **Para a Empresa:** A segurança de que o código de hoje rodará na tecnologia de amanhã.

_Escreva uma vez. Compile para qualquer coisa. Rode em qualquer lugar._

**Seja a Metamorfose.**
