# Ingestão de Legado (Omni Ingest)

O Omni Ingest é o módulo de **Engenharia Reversa por Padrões Canônicos**. Sua missão é "engolir" código legado (Java, PHP, COBOL, etc.) e "cuspir" Lógica Pura Omni moderna.

Não usamos tradução linha-a-linha (que gera código ruim). Usamos um **Motor de Mapeamento Semântico Determinístico**.

---

## Arquitetura: Extração Estrutural + Mapeamento Canônico

### 1. Estágio Mecânico: Tree-Sitter (Estrutura)

Usamos parsers robustos (Tree-Sitter) para criar uma **AST (Árvore de Sintaxe Abstrata)** do código original.

- **Função:** Garante que a estrutura lógica (loops, ifs, variáveis) seja capturada com 100% de precisão matemática.
- **Resultado:** Um grafo de sintaxe preciso, pronto para mapeamento.

### 2. Estágio Semântico: Regras de Equivalência (Intenção)

O **Motor de Mapeamento Semântico** analisa a AST e aplica um **Dicionário de Sinais Programáticos** para identificar a intenção:

- **Input:** Código imperativo sujo (ex: `for (i=0; i<x; i++) ...`)
- **Padrão Detectado:** "Iteração sobre coleção com filtro"
- **Regra de Equivalência:** Mapeia para Omni Declarativo (`items.filter(ativo: true)`)

O mapeamento é **determinístico** — a mesma entrada sempre produz a mesma saída.

### 3. Estágio de Metamorfose (Modernização)

A Ingestão separa o código monolítico em Domínios Omni usando **Blueprints de Separação**:

- **SQL misturado com Código:** Extraído para **Cápsulas de Dados** (`@entity`)
- **HTML misturado com PHP:** Extraído para **Componentes UI** (`@scope("ui")`)
- **Lógica de Negócio:** Extraída para **Fluxos** (`capsule Pagamento { flow processar }`)

---

## Motor de Transpilação Metamórfica

O Omni Ingest funciona como um **Grafo de Transformação AST-para-AST**:

```
┌─────────────────────────────────────────────────────────────┐
│                    OMNI INGEST ENGINE                       │
├─────────────────────────────────────────────────────────────┤
│  Código Fonte       Tree-Sitter        Regras de           │
│  (Java/PHP/C#)  ──▶  AST Parser   ──▶  Equivalência        │
│                                                             │
│                              │                              │
│                              ▼                              │
│                     ┌───────────────┐                       │
│                     │  Omni AST     │                       │
│                     │  Canônica     │                       │
│                     └───────────────┘                       │
│                              │                              │
│               ┌──────────────┼──────────────┐               │
│               ▼              ▼              ▼               │
│          ┌────────┐    ┌────────┐    ┌────────┐            │
│          │@entity │    │capsule │    │ @ui    │            │
│          │ (Data) │    │ (Logic)│    │(Views) │            │
│          └────────┘    └────────┘    └────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## Dicionário de Sinais Programáticos

O Motor usa um dicionário expansível de padrões:

| Sinal no Código Legado      | Intenção Detectada | Construto Omni           |
| --------------------------- | ------------------ | ------------------------ |
| `SELECT * FROM users WHERE` | Query de Dados     | `User.where(...)`        |
| `new PDO(...)`              | Conexão DB         | `@entity(storage: "db")` |
| `echo "<div>..."`           | Renderização UI    | `@ui component`          |
| `curl_exec(...)`            | Chamada Externa    | `@service interface`     |
| `session_start()`           | Estado de Sessão   | `capsule Session`        |

---

## Fluxo de Trabalho (CLI)

```bash
omni ingest ./projeto-legado-php --source php --goal microservices
```

1.  **Scanning:** Lê todos os arquivos do projeto antigo.
2.  **AST Extraction:** Parseia com Tree-Sitter para estrutura precisa.
3.  **Pattern Matching:** Aplica Regras de Equivalência do dicionário.
4.  **Interactive Offer:**
    > "Encontrei lógica de Pagamento no arquivo `utils.php`. Deseja extrair para `Capsule Pagamentos`?" [Y/n]
5.  **Generation:** Gera o código `.omni` limpo e um `omni.config.json` que reproduz a funcionalidade original.

---

## Independência de Infraestrutura

O código Omni é a **Verdade Única**. Após a ingestão:

- O mesmo código pode gerar um **Monolito PHP** hoje
- E **Microserviços Python** amanhã
- Apenas remapeando as **Cápsulas** no `omni.config.json`

Backend e Frontend são meros **detalhes de entrega**.

---

## Por que isso importa?

Isso transforma o Omni em uma ferramenta de modernização imediata. Empresas podem migrar sistemas legados gradualmente, componente por componente, sem reescrever tudo do zero manualmente.

A lógica é **determinística, reproduzível e auditável**. Não há aleatoriedade — apenas mapeamentos matemáticos entre grafos de AST.

_O Passado é Combustível. O Presente é Puro. O Futuro é Líquido._
