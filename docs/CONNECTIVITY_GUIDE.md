# Guia de Conectividade Omni (v6)

> **Expanda o Omni para qualquer linguagem, biblioteca ou framework.**

Este guia descreve como expandir o Omni para suportar novas linguagens, bibliotecas ou frameworks através do modelo **Híbrido de Metamorfose**.

---

## 1. Anatomia de um Target Package (.omni-pkg)

Um pacote de conectividade deve conter:

| Arquivo         | Descrição                                        |
| --------------- | ------------------------------------------------ |
| `grammar.json`  | Templates de sintaxe atómica                     |
| `bridge.omni`   | Lógica fixa para estruturas complexas (opcional) |
| `metadata.json` | Informações de versão e dependências             |

```
my-language.omni-pkg/
├── grammar.json      # Templates de sintaxe
├── bridge.omni       # Runtime/helpers em Omni puro
└── metadata.json     # Versão, autor, deps
```

---

## 2. Passo a Passo: Conectar uma Nova Linguagem

### Passo A: Mapeamento de Sintaxe (Templates)

Crie um ficheiro JSON em `targets/` seguindo o esquema canónico:

```json
{
  "name": "minha-linguagem",
  "extension": ".ml",
  "templates": {
    "let_decl": "local {name} = {value}",
    "fn_decl": "function {name}({params})\n{body}\nend",
    "if_stmt": "if {condition} then\n{consequence}\nend",
    "return_stmt": "return {value}"
  },
  "operators": {
    "eq": "==",
    "neq": "~=",
    "and": "and",
    "or": "or"
  },
  "type_map": {
    "i64": "number",
    "string": "string",
    "bool": "boolean"
  }
}
```

### Passo B: Implementação de Runtime (Código Fixo)

Se a linguagem alvo (ex: C) exigir gestão manual de memória ou um runtime específico:

1. Crie um ficheiro Omni puro (ex: `lib/runtime_c.omni`)
2. Defina as funções nativas de suporte
3. O compilador injetará este código automaticamente no topo do output

```omni
// lib/runtime_c.omni
native "c" {
    #include <stdlib.h>
    #include <string.h>

    void* omni_alloc(size_t size) {
        return malloc(size);
    }

    void omni_free(void* ptr) {
        free(ptr);
    }
}
```

---

## 3. Conectar um Framework (Ex: Next.js ou Laravel)

### Passo A: Mapeamento de Intenções (Adapters)

Associe anotações Omni a padrões do framework:

| Anotação Omni            | Next.js                | Laravel             |
| ------------------------ | ---------------------- | ------------------- |
| `@ui.button`             | `<Button>` React       | `<button>` Blade    |
| `@ui.screen`             | `page.tsx`             | `view.blade.php`    |
| `@server.get("/api/x")`  | `app/api/x/route.ts`   | `Route::get()`      |
| `@server.post("/api/x")` | `export POST`          | `Route::post()`     |
| `@entity User`           | `prisma/schema.prisma` | `migration + Model` |

### Passo B: Hooks de Estrutura

Para frameworks que exigem uma estrutura de pastas específica:

```javascript
// hooks/nextjs.js
module.exports = {
  createStructure(config) {
    return {
      "app/layout.tsx": renderLayout(config),
      "app/page.tsx": renderHomePage(config),
      "app/api/[...route]/route.ts": renderApiRoutes(config),
      "prisma/schema.prisma": renderPrismaSchema(config),
    };
  },
};
```

- O Omni usará a lógica fixa no `codegen.omni` para criar o "esqueleto" (Boilerplate)
- Se a estrutura mudar (ex: Next.js 14 → 15), basta atualizar o Hook de Estrutura no compilador

---

## 4. Garantia de Funcionamento

O Omni permite que a tradução falhe em sistemas legados complexos. Se ocorrer um erro:

```
┌───────────────────────────────────────────────────────────────┐
│  1. ERRO DETECTADO                                            │
│     └─▶ AST não mapeada para construto alvo                  │
│                                                               │
│  2. AJUSTE                                                    │
│     └─▶ Modifique targets/linguagem.json ou codegen.omni     │
│                                                               │
│  3. RECOMPILE                                                 │
│     └─▶ omni compile --target linguagem                      │
│                                                               │
│  4. GARANTIA MATEMÁTICA                                       │
│     └─▶ Paridade de AST = Funcionamento 100%                 │
└───────────────────────────────────────────────────────────────┘
```

**Princípio:** Uma vez que o mapeamento AST-para-AST está correto, a paridade matemática garante que o sistema funcionará 100% no alvo.

---

## 5. Checklist de Conectividade

- [ ] `targets/linguagem.json` criado com todos os templates básicos
- [ ] Operadores mapeados corretamente (`neq`, `and`, `or`)
- [ ] Tipos primitivos mapeados (`i64`, `string`, `bool`)
- [ ] Runtime injetado (se necessário)
- [ ] Teste com código simples (`fn main() { print("Hello") }`)
- [ ] Teste com estruturas (`struct`, `if`, `while`, `for`)
- [ ] Teste com classes/entidades (`@entity`)

---

## 6. Referência de Linguagens Suportadas

| Linguagem  | Profile               | Status       |
| ---------- | --------------------- | ------------ |
| JavaScript | `targets/js.json`     | ✅ Completo  |
| Python     | `targets/python.json` | ✅ Completo  |
| Lua        | `targets/lua.json`    | ✅ Completo  |
| C          | `targets/c.json`      | ✅ Base      |
| Rust       | `targets/rust.json`   | 🚧 Planejado |
| Go         | `targets/go.json`     | 🚧 Planejado |
| PHP        | `targets/php.json`    | 🚧 Planejado |

_O Omni é extensível por design. Adicione sua linguagem favorita!_
