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
