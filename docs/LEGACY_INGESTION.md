# Ingestão de Legado (Omni Ingest)

O Omni Ingest é o módulo de **Engenharia Reversa Automatizada**. Sua missão é "engolir" código legado (Java, PHP, COBOL, etc.) e "cuspir" Lógica Pura Omni moderna.

Não usamos tradução linha-a-linha (que gera código ruim). Usamos uma **Arquitetura Híbrida**.

---

## Arquitetura Híbrida: Estrutura + Intenção

### 1. Estágio Mecânico: Tree-Sitter (Estrutura)

Usamos parsers robustos (Tree-Sitter) para criar uma **AST (Árvore de Sintaxe Abstrata)** do código original.

- **Função:** Garante que a estrutura lógica (loops, ifs, variáveis) seja capturada com 100% de precisão matemática.
- **Resultado:** Um "Rascunho Omni" sintaticamente correto, mas semanticamente pobre (estilo "código traduzido").

### 2. Estágio Semântico: IA Generativa (Intenção)

Uma IA analisa a AST e o contexto para entender **O QUE** o código faz, não apenas **COMO**.

- **Input:** Código imperativo sujo (ex: `for (i=0; i<x; i++) ...`)
- **Insight da IA:** "Isso é um filtro de lista de clientes ativos."
- **Refatoração:** Reescreve para Omni Declarativo (`clientes.filter(ativo: true)`).

### 3. Estágio de Metamorfose (Modernização)

O Ingestão separa o código monolítico em Domínios Omni.

- **SQL misturado com Código:** Extraído para **Cápsulas de Dados** (`@entity`).
- **HTML misturado com PHP:** Extraído para **Componentes UI** (`@scope("ui")`).
- **Lógica de Negócio:** Extraída para **Fluxos** (`flow pagamento {...}`).

---

## Fluxo de Trabalho (CLI)

```bash
omni ingest ./projeto-legado-php --source php --goal microservices
```

1.  **Scanning:** Lê todos os arquivos do projeto antigo.
2.  **Analysis:** Detecta padrões (conexões de banco, rotas, views).
3.  **Interactive Offer:**
    > "Encontrei lógica de Pagamento no arquivo `utils.php`. Deseja extrair para `src/pagamentos`?" [Y/n]
4.  **Generation:** Gera o código `.omni` limpo e um `omni.config.json` que reproduz a funcionalidade original.

---

## Por que isso importa?

Isso transforma o Omni em uma ferramenta de modernização imediata. Empresas podem migrar sistemas legados gradualmente, componente por componente, sem reescrever tudo do zero manualmente.

_O Passado é Combustível._
