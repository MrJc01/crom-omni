# Arquitetura Técnica do Omni

A arquitetura do Omni foi desenhada para suportar a **Metamorfose Arquitetural**, permitindo que a mesma base de código (Lógica Pura) seja compilada para diferentes alvos, topologias e infraestruturas sem reescrita.

## 1. O Compilador Omni

O compilador não é apenas um tradutor de texto; é um orquestrador de paradigmas. Ele segue um fluxo de três estágios:

### Fluxo de Compilação

```mermaid
graph TD
    Source[Código Fonte .omni] --> Frontend[Frontend Parser]
    Frontend --> AST[Árvore de Sintaxe Abstrata]
    AST --> IR[Representação Intermediária Omni]

    subgraph "Metamorfose Engine"
        IR --> Optimizer[Otimizador de Fluxo]
        Optimizer --> Mapper[Mapper de Recursos Virtuais]
    end

    Mapper --> TargetA[Gerador PHP/Laravel]
    Mapper --> TargetB[Gerador C++/Rust]
    Mapper --> TargetC[Gerador JS/React]

    TargetA --> ArtifactA[Docker Container (Microserviço)]
    TargetB --> ArtifactB[Binário Nativo (Bare Metal)]
    TargetC --> ArtifactC[Bundle Web (Frontend)]
```

### Componentes Internos

1.  **Frontend:** Lê o código Omni (Sintaxe A+C), realiza checagem de tipos estática e validação de "Interfaces Canônicas".
2.  **IR (Intermediate Representation):** O coração agnóstico. Transforma loops e estruturas em grafos de lógica pura, desconectados de qualquer linguagem específica.
3.  **Backend (Geradores):** Módulos plugáveis (Plugins) que traduzem a IR para a linguagem final.
    - _Exemplo:_ Um `loop` na IR vira `for(...)` em C, `foreach` em PHP, ou recursão em Elixir.

---

## 2. Metamorfose Arquitetural

A capacidade de mudar a topologia do sistema via configuração (`omni.config.json`), sem tocar no código.

### Monolito vs. Microserviços

O código descreve **Fluxos de Domínio**, não serviços.

**Exemplo de Código (Lógica Líquida):**

```rust
domain Pedidos {
    flow processar(pedido: Pedido) {
        Estoque.reservar(pedido.produto_id); // Chamada lógica
        Pagamento.capturar(pedido);          // Chamada lógica
    }
}
```

**Transformação via Configuração:**

- **Modo Monolito (`metamorphosis: "monolith"`):** O compilador traduz `Estoque.reservar` como uma chamada de função em memória (`CALL 0x...`). Latência de nanosegundos.
- **Modo Distribuído (`metamorphosis: "distributed"`):** O compilador detecta que `Estoque` está em outro nó. Ele gera automaticamente:
  1.  Serialização do objeto `Pedido` para JSON/Protobuf.
  2.  Cliente HTTP/gRPC.
  3.  Tratamento de _retries_ e _timeouts_.
  4.  Servidor receptor no lado do Estoque.

---

## 3. Universal Container Executable (`.run`)

Para resolver o problema da distribuição e execução ("Funciona na minha máquina"), criamos o formato `.run`. Trata-se de um **Binário Poliglota Cosmopolita**.

### Anatomia do Arquivo `.run`

O arquivo é um binário único que funciona nativamente em Windows, Linux e macOS graças a um cabeçalho mágico manipulado.

| Seção               | Descrição                                                                                       |
| :------------------ | :---------------------------------------------------------------------------------------------- |
| **Polyglot Header** | Magia de bytes que faz o arquivo ser reconhecido como `.exe` (PE), Shell Script (ELF) e Mach-O. |
| **Micro-Runtime**   | Um kernel minúsculo (~4MB) embutido. Contém JIT, Garbage Collector opcional e HAL.              |
| **Bytecode Omni**   | A lógica do usuário compilada para um bytecode seguro e criptografado.                          |
| **Assets**          | Sistema de Arquivos Virtual (VFS) comprimido contendo imagens, configs e dados.                 |

### Fluxo de Execução

1.  **Auto-extração:** Ao ser executado, o runtime se carrega na RAM.
2.  **Abstração de OS (HAL):** Se o código chama `file.open`, o runtime traduz para a syscall correta (NTCreateFile no Windows, open no Linux).
3.  **Cleanup:** Ao fechar, nada resta no disco (a menos que persistido explicitamente no VFS).

---

## 4. Recursos Virtuais e Cápsulas

O Omni elimina a dependência direta de infraestrutura no código.

### Cápsulas (Logic Containers)

Unidades de lógica isoladas (caixas-pretas). Uma cápsula não sabe se está rodando numa AWS Lambda ou num Arduino.

```rust
capsule Processador {
    use db: StorageInterface; // Injeção de Dependência Abstrata de Nível de Linguagem
}
```

### Recursos Virtuais

Mapeamentos definidos no `omni.config.json` que conectam as Cápsulas ao mundo real.

- **No Código:** `Queue.send("msg")`
- **No Config (Dev):** `Queue` = `Array em Memória`.
- **No Config (Prod):** `Queue` = `Redis Cluster` ou `AWS SQS`.

Isso permite que a infraestrutura evolua (trocar Redis por Kafka) sem refatorar uma linha de regra de negócio.
