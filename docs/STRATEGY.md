# Omni Project Strategy - 55 Checkpoints

A roadmap for robust architectural metamorphosis.

## Nível 1: O Cérebro (Compilador Rust & Semântica)

- [ ] Análise Semântica: Implementar checagem de tipos antes da geração (evitar erros de variáveis duplicadas).
- [ ] Parallel Compilation: Usar a crate Rayon para compilar múltiplos arquivos simultaneamente.
- [ ] miette Error Handling: Mensagens de erro visuais com ponteiros exatos no código fonte.
- [ ] Generics (List<T>): Suporte a tipos genéricos na AST e no Parser.
- [ ] Type Inference: Melhorar a dedução automática de tipos para reduzir a verbosidade.
- [ ] Namespace/Module System: Suporte nativo a import "path/to/module" no Rust.
- [ ] Constant Folding: Otimização de expressões matemáticas em tempo de compilação.
- [ ] Lifetimes & Borrowing: Refatorar o Rust Core para usar referências (&str) em vez de clonar strings.
- [ ] Dead Code Elimination: Remover funções e cápsulas não utilizadas do bundle gerado.
- [ ] Bytecode Backend: Criar uma representação binária (.omnb) para execução via VM própria.

## Nível 2: Ingestão Universal (Legacy -> Omni)

- [ ] PHP Parser Engine: Motor para ler código PHP e extrair classes/métodos para Cápsulas Omni.
- [ ] Laravel Pattern Recognition: Detectar Routes e Eloquent Models e convertê-los em @entity e flow.
- [ ] Yii2 Ingestion Logic: Mapear o Active Record do Yii2 para o sistema de persistência do Omni.
- [ ] React to Omni View: Converter componentes JSX em definições de UI agnósticas.
- [ ] Node.js/Express Ingestion: Transformar middlewares de Express em cadeias de flow Omni.
- [ ] Legacy Ingestion CLI: Comando omni ingest ./legacy-project --output ./omni-project.
- [ ] Docstring Ingestion: Extrair comentários de documentação do código legado para o Omni.
- [ ] Dependency Mapping: Identificar pacotes npm/composer e sugerir substitutos no Omni.
- [ ] Incremental Migration: Permitir que o Omni rode "dentro" de um projeto legado (Hybrid Mode).
- [ ] AI-Assisted Refactoring: Hook para usar LLMs na limpeza de lógica complexa durante a ingestão.

## Nível 3: Metamorfose (Omni -> Frameworks)

- [ ] Laravel Generator: Gerar Controllers, Models e Migrations a partir de Cápsulas Omni.
- [ ] React Generator: Transformar lógica Omni em hooks useEffect e useState automáticos.
- [ ] Vue/Svelte Adapters: Geradores para outros frameworks frontend populares.
- [ ] Native C Backend: Gerar código C ANSI puro para sistemas embarcados e IoT.
- [ ] Docker Autogen: Criar o Dockerfile otimizado conforme o target (PHP-FPM, Node-Alpine, etc.).
- [ ] Hollow Core Expansion: Adicionar contratos para std.queue, std.cache e std.auth.
- [ ] SQL Driver Agnostic: Gerar SQL dialetado para MySQL, PostgreSQL e SQLite simultaneamente.
- [ ] API Documentation Gen: Gerar Swagger/OpenAPI automaticamente a partir dos flow.
- [ ] GraphQL Adapter: Transformar Cápsulas de dados em schemas GraphQL.
- [ ] State Machine Gen: Converter fluxos lógicos em máquinas de estado formais.

## Nível 4: Execução & DX (omni run)

- [ ] Universal Run Command: omni run main.omni --php (inicia servidor PHP interno).
- [ ] Hot Reload Engine: Monitorar arquivos e recompilar apenas o necessário em milissegundos.
- [ ] Environment Manager: Gerenciar versões de Node, PHP e Python automaticamente (estilo asdf).
- [ ] Studio Preview 3D Live: Ponte Three.js funcional para renderizar std.3d em tempo real.
- [ ] TUI 2.0: Interface rica usando ratatui (Rust) com gráficos de uso de CPU/Memória.
- [ ] Visual Node Debugging: Mostrar no Studio qual "Nó" está sendo executado no momento.
- [ ] Global Config Center: omni config --set registry=custom para gerenciar o ecossistema.
- [ ] Log Observability: Sistema de logs unificado independente do target.

## Nível 5: Segurança & Soberania

- [ ] Native Sandbox: Isolar blocos native em processos separados com permissões restritas.
- [ ] Checksum Validation: Gravar SHA-256 de todos os pacotes Git no omni.lock.
- [ ] Audit Tool: Comando omni audit para verificar vulnerabilidades em dependências.
- [ ] Secret Management: Sistema para lidar com .env e chaves sem expor no código Omni.
- [ ] Signing Engine: Permitir assinar pacotes Omni para garantir autoria.
- [ ] Offline Mode: Cache completo de bibliotecas para desenvolvimento sem internet.
- [ ] Binary Self-Update: Comando omni upgrade para atualizar o binário Rust e as Libs.

## Nível 6: Documentação & Persistência (Manual do Sistema)

- [ ] Sovereign MD Docs: Gerar documentação técnica a partir dos arquivos .omni.
- [ ] Context Persistence File: Criar um arquivo OMNI_CONTEXT.json que resume o estado do projeto para IAs.
- [ ] Interactive Tutorial: Guia passo a passo dentro da TUI para novos usuários.
- [ ] Metamorphosis Guide: Documentar como criar novos adaptadores de framework.
- [ ] QA Test Suite Docs: Explicar como escrever testes de paridade entre linguagens.
- [ ] FAQ de Ingestão: Resolver problemas comuns de conversão de PHP/JS.
- [ ] Architecture.md v2: Desenhos de arquitetura em Mermaid dentro da doc.
- [ ] Roadmap Visual: Painel no Studio mostrando o progresso das tasks.
- [ ] Changelog Automático: Gerar notas de versão a partir dos commits.
- [ ] IA-Ready Documentation: Indexar a doc para que assistentes entendam a sintaxe perfeitamente.
