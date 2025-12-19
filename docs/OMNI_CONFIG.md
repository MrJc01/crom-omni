# Configuração Omni (`omni.config.json`)

O arquivo `omni.config.json` (ou `omni.json`) é o cérebro do projeto. No Omni, o código define **O QUÊ**, e este arquivo define **ONDE** e **COMO**.

É aqui que você alterna entre Monolito e Microserviços, Local e Nuvem, Desenvolvimento e Produção.

## Estrutura Completa

```json
{
  "project": {
    "name": "sistema-gestao",
    "version": "1.0.0",
    "author": "Omni Team"
  },

  // Perfil padrão ao rodar 'omni build' ou 'omni run'
  "default_profile": "dev",

  // 1. Perfis de Compilação (Ambientes)
  "profiles": {
    // Desenvolvimento: Rápido, Hot-Reload, Logs máximos
    "dev": {
      "metamorphosis": "monolith", // Roda tudo junto num processo só
      "optimization": "none",
      "debug_symbols": true,
      "cache": true,
      "targets": ["backend-local", "frontend-local"]
    },

    // Produção: Microserviços, Docker, Criptografado
    "prod": {
      "metamorphosis": "distributed", // Separa em microserviços
      "optimization": "aggressive",
      "encryption": "aes-256", // Proteção de código
      "targets": ["backend-prod", "frontend-prod", "worker"]
    }
  },

  // 2. Metamorfose e Topologia (Só usado se metamorphosis="distributed")
  "metamorphosis_map": {
    "nodes": {
      "pedidos_service": ["src/pedidos"], // Este nó roda o domínio Pedidos
      "pagamentos_service": ["src/pagamentos", "src/fiscal"]
    },
    // Como os nós conversam?
    "communication": "http_rest" // Opções: "grpc", "rabbitmq", "direct_memory"
  },

  // 3. Definição de Alvos (Targets)
  "targets": {
    // Backend PHP com Laravel
    "backend-prod": {
      "language": "php",
      "version": "8.2",
      "strategy": "framework",
      "framework": "laravel", // Compilador gera Controllers e Models Laravel
      "infrastructure": {
        "container": true, // Gera Dockerfile
        "base_image": "php:8.2-fpm-alpine",
        "requirements": {
          "memory": "512M"
        }
      }
    },

    // Frontend React
    "frontend-prod": {
      "language": "javascript",
      "framework": "react",
      "style_system": "tailwind",
      "output_dir": "./dist/public"
    },

    // Worker de Alta Performance (Go Bare Metal)
    "worker": {
      "language": "go",
      "mode": "bare-metal" // Sem framework
    }
  },

  // 4. Mapeamento de Recursos Virtuais
  "resources": {
    "main_db": {
      "type": "database",
      "adapters": {
        "dev": { "driver": "sqlite", "source": "./dev.db" },
        "prod": {
          "driver": "postgres",
          "container": { "image": "postgres:15" }
        }
      }
    }
  }
}
```

## Casos de Uso

### Mudança Local -> Nuvem

Para mudar seu banco de dados de um arquivo local para um Postgres na Nuvem, você não altera o código. Você altera o adaptador em `resources` de `sqlite` para `postgres`. O Omni recompila a camada de acesso a dados.

### Troca de Framework

Para mudar de `Laravel` para `Symfony`, altere `"framework": "laravel"` para `"framework": "symfony"`. O compilador reescreve toda a camada de HTTP/Rotas para se adequar ao novo framework, mantendo sua lógica de negócios intacta.

## Configurações do Compilador

```json
"compiler": {
  "concurrency": "auto", // Usa todos os cores da CPU
  "hot_reload": true,
  "registry_url": "https://registry.omnilang.io",
  "plugins": ["omni-security-scanner", "omni-asset-optimizer"]
}
```

---

## 🌍 Arquitetura de Sistemas Poliglotas

O Omni foi projetado para a era pós-monólito. Uma das suas capacidades mais poderosas é o **Build Multi-Target Poliglota**.

Isso permite que você mantenha todo o seu sistema (Frontend, Backend, Workers, Scripts) em um único repositório (Monorepo), escrevendo tudo em Omni, mas compilando cada parte para a tecnologia mais adequada.

### Exemplo de Configuração (`omni.config.json`)

Neste cenário, um único comando `omnic build` gera:

1.  Um servidor **Python** (para IA/Data Science).
2.  Uma interface web **JavaScript/React** (para o usuário).
3.  Um worker de alta performance (futuro target Go/Rust).

```json
{
  "project": {
    "name": "SuperApp",
    "version": "2.0.0"
  },
  "targets": {
    "api_server": {
      "format": "python",
      "source": "src/backend/server.omni",
      "output": "dist/api",
      "bundle": true
    },
    "web_client": {
      "format": "js",
      "source": "src/frontend/app.omni",
      "output": "dist/public/assets"
    },
    "data_worker": {
      "format": "python",
      "source": "src/workers/processor.omni",
      "output": "dist/workers"
    }
  }
}
```

### Fluxo de Build

1. **Source Único:** Você define suas regras de negócio e tipos de dados (Structs) uma única vez em `.omni`.
2. **Transpilação Divergente:** O compilador lê o config e bifurca o processo.
3. **Interoperabilidade:** Módulos compartilhados (ex: `src/shared/models.omni`) são compilados para ambas as linguagens, garantindo que o Backend Python e o Frontend JS sempre concordem sobre o formato dos dados.

### Tabela de Decisão de Targets

| Target            | Melhor Caso de Uso                             | Output Gerado       |
| ----------------- | ---------------------------------------------- | ------------------- |
| **JS (Node/Web)** | UI, IO-bound services, Serverless              | `.js` (ES6 Modules) |
| **Python**        | Data Science, Scripts de Automação, Backend AI | `.py` (Type Hinted) |
| **C++ / Rust**    | (Futuro) Systems Programming, Games            | Binário Nativo      |

---

## Easy Polyglot: Frontend & Backend Unificados

Com o Omni, dividir seu sistema não significa dividir seu repositório. Use um único config para gerar um **Frontend React (JS)** e um **Backend API (Python)** que compartilham as mesmas regras de negócio.

### Configuração Simples

```json
// omni.config.json
{
  "targets": {
    "website": {
      "format": "js",
      "source": "src/ui/main.omni",
      "output": "dist/website"
    },
    "api": {
      "format": "python",
      "source": "src/server/api.omni",
      "output": "dist/api"
    }
  }
}
```

Execute `omnic build` e veja as pastas `dist/website` e `dist/api` nascerem juntas. 🚀

### O Poder do Código Compartilhado

```
src/
├── shared/
│   └── models.omni    ← Struct User, Struct Order (uma vez só!)
├── ui/
│   └── main.omni      ← Frontend React usa models
└── server/
    └── api.omni       ← Backend Python usa os mesmos models
```

O compilador garante que `User` em JS e `User` em Python tenham **exatamente os mesmos campos**. Acabaram os bugs de "o frontend espera `user_name` mas o backend manda `userName`".

```

```
