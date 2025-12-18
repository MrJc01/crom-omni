# Guia de Sintaxe Omni (Estilo A+C)

A sintaxe Omni é uma fusão pragmática: a familiaridade, estrutura e legibilidade do **C/Java** (chaves `{}`) com a segurança, concorrência e inferência de tipos modernas do **Rust/Go**.

Chamamos esse estilo de **"A+C"**.

---

## Estrutura Básica

### Definição de Pacotes e Imports

O Omni utiliza um sistema de imports inteligente baseados no Registry.

```rust
package com.sistema.financeiro;

// Importação de Interface Canônica (Contrato)
import @std/http;
import @std/crypto;

// Importação de Módulo Local
import modulos.usuario;
```

### Funções e Variáveis

Imutabilidade por padrão (segurança). Sintaxe limpa.

```rust
fn main() {
    // Imutável (Padrão Rust)
    let taxa: f64 = 10.5;

    // Mutável (Explícito)
    mut saldo: f64 = 1000.00;

    // Inferência de Tipos
    if (saldo > 0) {
        saldo = saldo - taxa;
    }

    print("Saldo final: " + saldo);
}
```

---

## Tipos de Dados

### Structs e Entidades

Não usamos Classes complexas com herança oculta. Usamos Structs para dados e Composition para comportamento.

```rust
// @entity indica que este dado pode ser persistido (SQL/NoSQL)
@entity(storage: "sql")
struct Usuario {
    id: i64,            // Inteiro 64 bits
    nome: string,
    email: string,
    ativo: bool
}
```

### Interfaces Canônicas

Interfaces definem contratos que as bibliotecas devem cumprir. Isso evita fragmentação.

```rust
interface StorageInterface {
    fn salvar(chave: string, valor: any);
    fn ler(chave: string) -> any;
}

// Seu código depende da Interface, não da implementação
fn processar(db: StorageInterface) {
    db.salvar("status", "ok");
}
```

---

## Coleções

### Arrays

Listas de tamanho dinâmico (no MVP).

```rust
let lista = [1, 2, 3];
let item = lista[0]; // Acesso por índice
```

## Estruturas de Controle

### Loops

Suporte a iteração definida e indefinida.

```rust
// For-In (Iteração sobre arrays)
let users = ["Ana", "Bob"];
for (user in users) {
    print(user);
}

// While (Iteração condicional)
mut i = 0;
while (i < 10) {
    i = i + 1;
}
```

---

## Túneis Nativos (`native {}`)

O Omni segue a filosofia "Core Oco", incentivando o uso de bibliotecas. Porém, para necessidades extremas (drivers, otimização crítica), permitimos "furar" a abstração.

```rust
fn acesso_baixo_nivel() {

    // Compilando para C (Kernel/Embedded)
    native("c") {
        int *ptr = (int*)0xB8000;
        *ptr = 0xFF; // Acesso direto à memória de vídeo
    }

    // Compilando para Web (JS)
    native("js") {
        console.log("Acesso direto ao V8/Browser");
        window.alert("Nativo Web");
    }

    // Fallback Seguro
    fallback {
        print("Este recurso não está disponível nesta plataforma.");
    }
}
```

---

## Atributos (`@attributes`)

Usamos decoradores poderosos para metadados e controle de compilador.

| Atributo                  | Descrição                                           |
| :------------------------ | :-------------------------------------------------- |
| `@route("GET", "/url")`   | Mapeia função para rota HTTP.                       |
| `@entity(storage: "sql")` | Mapeia struct para tabela de banco.                 |
| `@scope("ui")`            | O bloco só existe se o target for Frontend.         |
| `@scope("hardware")`      | O bloco só existe se o target for Baixo Nível.      |
| `@no_std`                 | Desliga a biblioteca padrão (para kernels/drivers). |
| `@secure(level: "aes")`   | Criptografa o bloco compilado.                      |

---

## Tratamento de Erros e Concorrência

### Concorrência Agnóstica

```rust
// 'spawn' cria uma Thread (Java/Rust) ou Promise (JS) dependendo do target
spawn tarefa_pesada();
```

### Async/Sync Automático

Se o target não suporta Async nativo (ex: PHP antigo), o compilador pode usar _Fibers_ ou gerar código síncrono com avisos, ou delegar para filas de mensagens, dependendo do `omni.config`.
