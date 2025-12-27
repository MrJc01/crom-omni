# Crom-Omni Platform 🪐

> **Soberania da Lógica. Fluidez da Arquitetura. Universalidade da Execução.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-v2.0--beta-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

O **Omni** é uma plataforma de engenharia de software desenhada para dissociar a **Lógica de Negócios** da **Infraestrutura**. Escreva sua lógica uma vez e compile-a para Monolitos, Microserviços, Scripts Python, Apps Node.js ou Executáveis Universais.

---

## 🚀 Funcionalidades Principais

O compilador `omnic` (escrito em Node.js/Rust) é capaz de:

1.  **Sintaxe A+C:** Uma linguagem moderna, segura e tipada (mistura de Rust e TypeScript).
2.  **Geração Híbrida:** Compila código nativo para **JavaScript (Node.js/Web)** e **Python**.
3.  **App & WebApp:** Suporte nativo para criar aplicações Desktop (`--app` via Tkinter) e PWAs Chromeless (`--web-app`).
4.  **Zero Config:** O sistema de build `manual_build.ps1` e `omni.bat` gerenciam todo o ciclo de vida.

---

## 📦 Instalação

### Pré-requisitos

- **Node.js**: v18+ (Para o compilador e runtime JS).
- **Python**: v3.10+ (Para o runtime Python e Apps Nativos).
- **Git**: Para clonar o repositório.

### Setup

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/crom-omni.git
   cd crom-omni
   ```

2. O compilador já vem pré-empacotado em `omnic-v2/dist/omni_bundle.js`. O script `omni.bat` na raiz faz a ponte para execução.

---

## 🎮 Testando o Hub de Exemplos

A melhor maneira de explorar o Omni é através do **Hub de Exemplos**. Ele é uma aplicação interativa que lista e executa todos os 20+ exemplos disponíveis no projeto.

### ⚡ Como Executar o Hub

Abra seu terminal na raiz do projeto e execute:

```powershell
.\omni.bat run examples\hub.omni
```

Isso abrirá um menu interativo onde você pode:

1.  Navegar pelos exemplos (Básico, IO, Rede, 3D, Fullstack).
2.  Escolher o modo de execução (`Run`, `Compile JS`, `Compile Python`).
3.  Ver o código fonte dos exemplos.

### Exemplos de Destaque

- **Exemplo 10 (Solar System):** Animação 3D complexa.
  - Teste Desktop: `.\omni.bat run examples\10_animated_solar_system\src\main.omni --app`
  - Teste Web: `.\omni.bat run examples\10_animated_solar_system\src\main.omni --web`
- **Exemplo 26 (Fullstack App):** Aplicação completa com Backend e Frontend.
  - Rodar App: `.\omni.bat run examples\26_fullstack_app\src\main.omni --app`

---

## 🛠️ Como Usar (CLI)

### Compilar e Rodar (`run`)

O comando `run` compila e executa o arquivo imediatamente (JIT-like).

```bash
# Execução padrão (Node.js)
.\omni.bat run arquivo.omni

# Modo Web (Abre no navegador padrão)
.\omni.bat run arquivo.omni --web

# Modo App Nativo (Janela Python/Tkinter)
.\omni.bat run arquivo.omni --app

# Modo Web App (Janela Chromeless)
.\omni.bat run arquivo.omni --web-app
```

### Compilar para Arquivo (`compile`)

Gera o código fonte na linguagem alvo para distribuição.

```bash
# Compilar para JavaScript
.\omni.bat compile arquivo.omni saida.js --target js

# Compilar para Python
.\omni.bat compile arquivo.omni saida.py --target python
```

---

## 📂 Estrutura do Projeto

- **`omnic-v2/`**: Código fonte do compilador (Core, Parser, CodeGen).
- **`std/`**: Biblioteca padrão do Omni (Math, FileSystem, 3D, Net).
- **`examples/`**: Coleção de 20+ exemplos demonstrando todas as capacidades.
- **`omni.bat`**: Wrapper para execução fácil no Windows.

---

## 🔮 Status do Projeto

- [x] **Core Compiler**: Funcional e Estável (Parser, AST, Hybrid CodeGen).
- [x] **Targets**: JavaScript e Python com paridade de funcionalidades.
- [x] **Modos de Execução**: CLI, Web Server, Native GUI.
- [x] **Hub de Exemplos**: 100% Funcional.

---

_Criado com Lógica Líquida._
