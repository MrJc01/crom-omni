# Omni Studio Vision

> **O Omniverse do código: visualize, edite e execute qualquer projeto, em qualquer linguagem, de qualquer lugar.**

---

## O Manifesto do Studio

O Omni Studio não é apenas uma IDE. É uma **interface universal para o código**. Ele transcende a dicotomia entre "código textual" e "programação visual" ao tratá-los como duas representações do mesmo grafo de intenções. Um fluxo desenhado em nós é idêntico a um arquivo `.omni`. Uma função escrita em código é um nó no grafo. Não há tradução, não há conversão — é a mesma verdade.

---

## Princípios Arquiteturais

### 1. Código-Grafo Isomorfismo

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   CÓDIGO OMNI  ◄═══════════════════════════════════════════►  GRAFO DE NÓS │
│                                                                           │
│   fn getUserById(id: i64) -> User          ◄═══►   [getUserById]         │
│   @server.get("/api/users/:id")                    ├─[ param: id ]       │
│                                                    └─[ return: User ]    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

**Regra:** Qualquer alteração no código atualiza o grafo. Qualquer alteração no grafo atualiza o código. A consistência é matemática.

### 2. Universalidade de Plataforma

O Studio roda em:

| Plataforma                  | Tecnologia     | Comando                      |
| --------------------------- | -------------- | ---------------------------- |
| Web (Browser)               | Vite + React   | `omni studio`                |
| Desktop (Windows/Mac/Linux) | Tauri Webview  | `omni studio --app`          |
| Mobile (Android)            | Capacitor APK  | `omni package --app android` |
| Terminal (TUI)              | ANSI Rendering | `omni studio --tui`          |

### 3. Cross-Runner Universal

O Studio pode **executar qualquer projeto**, independente da linguagem:

```
┌─────────────────────────────────────────────────────────────────┐
│                      CROSS-RUNNER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Omni     →  omni run app.omni                                  │
│  Node.js  →  npm run dev                                        │
│  Python   →  python -m uvicorn app:main                         │
│  PHP      →  php artisan serve | yii serve                      │
│  Java     →  ./gradlew bootRun                                  │
│  Rust     →  cargo run                                          │
│  Go       →  go run .                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

O Studio detecta automaticamente o tipo de projeto pelo arquivo de configuração (`package.json`, `Cargo.toml`, `composer.json`, etc.) e propõe os comandos adequados.

---

## Arquitetura do Studio

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OMNI STUDIO                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐│
│  │    EDITOR     │  │    GRAFO      │  │   TERMINAL    │  │   PREVIEW     ││
│  │   (Monaco)    │  │   (Cytoscape) │  │   (Xterm.js)  │  │   (Iframe)    ││
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         STUDIO ENGINE                                   ││
│  │  • AST State Manager                                                    ││
│  │  • Process Manager (Cross-Runner)                                       ││
│  │  • Package Registry (omni install)                                      ││
│  │  • Build Pipeline                                                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integração com a Comunidade

### Bibliotecas Instaláveis

Qualquer membro da comunidade pode criar um pacote `.omni-pkg` que aparece automaticamente no Studio:

1. **Targets** (`targets/*.json`) - Novas linguagens de compilação
2. **Adapters** (`adapters/*.json`) - Novos frameworks (Next.js, Laravel, Android)
3. **Patterns** (`patterns/*.json`) - Regras de ingestão de código legado
4. **Widgets** (futuro) - Componentes visuais personalizados para o grafo

```bash
# Instalar um target da comunidade
omni install https://registry.omni-lang.org/targets/kotlin.json

# O Studio agora mostra "Kotlin" como opção de compilação
```

### Registry de Pacotes

O Studio conecta-se ao **Omni Registry** (`registry.omni-lang.org`) para:

- Buscar pacotes por nome
- Exibir estrelas, downloads e compatibilidade
- Atualizar automaticamente pacotes instalados

---

## Roadmap do Studio

| Versão | Funcionalidade                        |
| ------ | ------------------------------------- |
| 0.1    | Servidor web local + editor Monaco    |
| 0.2    | Visualização de grafo de nós          |
| 0.3    | Cross-Runner com output em tempo real |
| 0.4    | Instalação de pacotes via UI          |
| 0.5    | Desktop app (Tauri)                   |
| 1.0    | Mobile app (Capacitor)                |

---

## Comandos do Studio

```bash
# Iniciar servidor de desenvolvimento
omni studio

# Iniciar com janela nativa (Tauri)
omni studio --app

# Modo terminal (TUI)
omni studio --tui

# Especificar porta
omni studio --port 3000

# Empacotar como app nativo
omni package --app windows
omni package --app android
```

---

## A Promessa do Studio

> **"Código é visualização. Visualização é código. Não há distinção."**

O Omni Studio é a manifestação final da filosofia Omni: a lógica pura deve fluir livremente entre representações. Seja escrevendo código, desenhando fluxos ou clicando em botões — você está sempre manipulando a mesma AST universal.

_Welcome to the Omniverse._
