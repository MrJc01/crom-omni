# OMNI_TASKS.md - The Sovereign Checklist

## Phase 1.5: Purification & Robustness (current)

1. [ ] **Fix Apostrophe Corruption:** Treat `native` blocks as Raw Text in `js.rs`.
2. [x] **Purge System:** Delete `.log`, `.txt`, and temp binaries.
3. [ ] **Sovereign GitIgnore:** Update `.gitignore` to exclude build artifacts.
4. [ ] **miette Integration:** Implement colored error reporting in Rust.
5. [ ] **Semantic Analysis Phase:** Validate duplicates and types before codegen.
6. [ ] **Parallel Test Runner:** Use `rayon` for parallel testing.
7. [ ] **JSON Config Parser:** Strict validation for `omni.conf.json`.
8. [x] **Consistent CLI Args:** Standardize argument parsing (clap/structopt).
9. [ ] **Error Code Registry:** centralized error codes (e.g., E001).
10. [ ] **Logger Implementation:** Structured logging for compiler debug.
11. [ ] **Code Formatting:** Implement `omni fmt` basic logic.
12. [ ] **Linter Core:** Start `omni lint` for unused variables.
13. [ ] **Dependency Graph:** Visualize module imports.
14. [ ] **Dead Code Elimination:** Identify unused functions.
15. [ ] **Type Inference Engine:** Improve type deduction for `let`.

## Phase 2: Universal Ingestion (Legacy -> Omni)

16. [x] **PHP Parser:** Basic PHP syntax parsing (Regex based).
17. [ ] **Yii2 Active Record Capsule:** Extract AR logic.
18. [ ] **Laravel Route Matcher:** Convert web.php to flow.
19. [ ] **Eloquent Model Ingestor:** Map Models to `@entity`.
20. [ ] **React JSX Ingestor:** Convert JSX to Omni UI nodes.
21. [ ] **React Hook Mapper:** Map `useState`/`useEffect`.
22. [ ] **Express Middleware Ingestor:** Chain mapping.
    - [ ] **Laravel Middleware Pattern:** Handle `handle($request, $next)`.
    - [ ] **Express Middleware Pattern:** Handle `(req, res, next)`.
23. [ ] **SQL Schema Ingestor:** DDL to `@entity`.
    - [ ] **Eloquent Relationships:** HasOne, HasMany parser.
    - [ ] **Eloquent Scopes:** Local scope parser.
24. [ ] **Env Var Ingestor:** `.env` to Config constants.
25. [ ] **Package.json Parser:** Dependency mapping.
26. [ ] **Composer.json Parser:** PHP dependency mapping.
27. [ ] **Css Ingestor:** CSS to Omni Style blocks.
    - [ ] **Agnostic CSS Generation:** Abstract CSS to JSON/Omni.
    - [ ] **Tailwind Interpreter:** Class to Style block converter.
28. [ ] **Folder Structure Mapper:** Replicate project tree.
29. [ ] **Legacy Comment Preserver:** Keep comments in migration.
30. [ ] **Ingestion Report:** Generate summary of migration.

## Phase 3: Universal Metamorphosis (Omni -> Frameworks)

31. [ ] **Target --laravel:** Basic Controller structure.
32. [ ] **Laravel Migrations:** Entity to Migration files.
33. [ ] **Laravel Models:** Entity to Eloquent Models.
34. [ ] **Laravel Views:** UI nodes to Blade templates.
35. [ ] **Target --react:** Basic Component structure.
36. [ ] **React State Management:** Flow to Context/Redux.
37. [ ] **React Router:** Flow to React Router.
38. [ ] **Target --vue:** Vue 3 Composition API output.
39. [ ] **Target --angular:** Component/Service output.
40. [ ] **Target --php-vanilla:** No framework PHP output.
41. [ ] **Target --python-flask:** Flask route generation.
42. [ ] **Target --python-django:** Django model/view generation.
43. [ ] **Hollow Runtime (PHP):** `omni.php` type shims.
44. [ ] **Hollow Runtime (JS):** `omni.js` type shims.
45. [ ] **Hollow Runtime (Python):** `omni.py` type shims.

## Phase 4: Binary Sovereignty

46. [ ] **C-Native Target:** Basic C output structure.
47. [ ] **Memory Management:** Manual/GC strategy for C.
48. [ ] **Struct Mapping:** Entity to C structs.
49. [ ] **Function Mapping:** Flow to C functions.
    - [ ] **C Memory Arena:** Bump pointer allocator.
    - [ ] **C FFI Bindings:** `extern "C"` generation.
    - [ ] **C Header Gen:** `.h` file automation.
    - [ ] **C Makefile Gen:** Universal makefile.
    - [x] **Task 04.2.1: C-Transpiler Core:** Implement generation of ANSI C in `omnic/src/targets/c.rs`.
    - [ ] **Task 04.2.2: Memory Management in C:** Simple Reference Counting for structs.

## Level 4: Soberania C-Nativa

- [ ] **Task 04.2.2:** RC Injetor. Injetar funções de retain/release em structs C.
- [ ] **Task 04.2.3:** String implementation in C. Criar um wrapper `omni_string` para evitar leaks.
- [ ] **Task 04.4:** Compiler-in-compiler. Traduzir o Lexer de Rust para Omni puro.

## Level 5: Testes de Paridade (Inquebrável)

- [ ] **Task 05.1:** Bit-by-bit Parity. O tester deve validar se `run --js` e `run --c` produzem a mesma saída.
- [ ] **Task 05.2:** Chaos Monkey. Script que deleta arquivos `dist/` aleatoriamente para testar recuperação.
- [ ] **Task 05.3: Error Source Locator.** O compilador Rust deve apontar o arquivo/linha original .omni.
- [ ] **Task 05.4: Automatic Fix Loop.** Hook para permitir autismo correção baseada em `test_report.json`.

## Level 6: Integração Profunda (Industrial)

- [ ] **Task 06.1: Component Mapping.** Ingerir sub-componentes React e manter o Grafo de Dependência.
- [ ] **Task 06.2: Universal Router.** Mapear rotas Express/Laravel para uma única cápsula Router agnóstica.
- [ ] **Task 06.3: C ownership model.** Injetar retain/release em cada atribuição de struct no C.
- [ ] **Task 06.4: Incremental Compilation.** Gerar hashes de arquivos para evitar recompilação desnecessária.

## Level 8: Maestria Ambiental

- [x] **Task 08.1: Shadow Sync.** Garantir limpeza do `omnic_temp.exe` (via Repair).
- [ ] **Task 08.2: HTTP Header Mapping.** Suportar Headers/Cookies em `std/http`.
- [x] **Task 08.3: Dynamic Route Logic.** Ingestão de `{id}` para `@route`.
- [ ] **Task 08.4: Standalone Ingestion.** Download automático de parsers.
- [x] **Task 08.5: Omni Repair.** Comando de auto-cura do build.
- [x] **Task 08.6: HTTP Adapter (JS).** Implementação zero-dep para Node.js.

## Level 9: O Grande Ciclo (Metamorfose)

- [ ] **Task 09.1: Ingestor Unification.** Unificar lógica Node/PHP/React num único motor semântico.
- [ ] **Task 09.2: First HTTP Request.** Validar o ciclo Request/Response no alvo JS.
- [ ] **Task 09.3: C Socket Implementation.** Implementar o backend de rede para o alvo C.
- [ ] **Task 09.4: Full Cycle Proof.** Ingerir `examples/28_universal_route.php` e rodar via `--web`.
- [ ] **Task 09.5: Repair Integration.** Sugerir `repair` em falhas de build.

## Level 11: Independência Intelectual (Hollow VM)

- [x] **Task 11.1: OpCode Definition.** Definir a tabela de instruções para a Hollow VM (`vm.rs`).
- [x] **Task 11.3: Visual Trace.** O Studio (CLI) deve mostrar o "pulso" da VM executando os opcodes.
- [x] **Task 11.4: Bootstrap Integration.** Iniciar tradução do Lexer para `bootstrap.omni`.

## Level 12: A Singularidade (Metamorfose & Caos)

- [x] **Task 12.1: Semantic Logic.** Mapear herança de classes legadas para composição de cápsulas.
- [x] **Task 12.2: DB Ingestor.** Transformar PDO ou TypeORM em fluxos `@database`.
- [x] **Task 12.3: Reference Counting (C).** Injetar retain/release em cada atribuição no alvo C.
- [ ] **Task 12.4: Asset Metamorphosis.** Suportar arquivos .css e .html no comando `run --app`.
- [ ] **Task 12.5: Parity Report Auto-Fix.** O sistema deve ler o `test_report.json` e sugerir o código Rust corrigido.
- [x] **Task 12.6: Global Chaos Tester.** Implementar `scripts/global_chaos_tester.omni` com paridade bit-a-bit.
- [ ] **Task 12.7: Bootstrap Parser.** Traduzir o Parser de Rust para Omni.
- [ ] **Task 12.8: Bootstrap CodeGen.** Traduzir o Backend JS para Omni.
- [ ] **Task 12.9: Self-Hosting Verification.** Compilar `01_hello.omni` usando o Bootstrap.

## Level 13: Metamorfose de Assets & Estúdio

- [x] **Task 13.1: Resource Compiler.** Integrar assets binários (.css, .png) como cápsulas de dados.
- [ ] **Task 13.2: AST-to-Source Generator.** Gerar código .omni formatado a partir da AST (Round-trip).
- [ ] **Task 13.3: Visual Route Debugging.** Studio deve mostrar pacotes de rede fluindo (Visualização).
- [ ] **Task 13.4: Bidirectional Sync.** `omni studio --sync` atualiza o arquivo original ao editar no Studio.

## Level 10: Execução Soberana

- [x] **Task 10.1: Serial Build Enforcer.** Garantir builds determinísticos e sem travas (`--jobs 1` / remove `par_iter`).
- [x] **Task 10.2: C HTTP Server.** Servidor HTTP real rodando em C puro (Unix/Win Sockets).
- [x] **Task 10.3: Bytecode Generator.** Primeira versão do alvo `--target bytecode` (Hollow VM).
- [ ] **Task 10.4: Parity Report v2.** Comparar performance de rede: Node.js vs C Nativo.

## Level 7: Roteamento e Resiliência

- [ ] **Task 07.1: Shadow Execution.** Implementar rotação de binários no build (`omni.bat` shadow copy).
- [ ] **Task 07.2: Route Pattern Matcher.** Ingerir sistemas de roteamento (Express/Laravel) para `@route`.
- [ ] **Task 07.3: Universal HTTP Capsule.** Contrato `std.http` unificado.
- [ ] **Task 07.4: Binary Self-Update.** Lógica de auto-update do binário.

50. [ ] **StdLib in C:** Implement core stdlib in C.
51. [ ] **Self-Hosting Bootstrap:** Compiler compiling itself.
52. [ ] **Standalone Binary:** `omni.exe` (no node/rust req).
53. [ ] **Cross-Compilation:** Build for Linux/Mac on Windows.
54. [ ] **Binary Optimization:** `-O3` equivalent flags.
55. [ ] **Runtime Embedding:** Embed minimal runtime in binary.

## Phase 5: Quality & Automation

56. [ ] **Tester.omni:** Comprehensive test suite script.
57. [ ] **Parity Check:** JS vs Python output comparison.
58. [ ] **Fuzz Testing:** Random input generation.
59. [ ] **Benchmarking:** Compile time tracking.
60. [ ] **Runtime Perf:** Execution speed metrics.
61. [ ] **Regression Suite:** Auto-add tests for fixed bugs.
62. [ ] **CI Integration:** GitHub Actions workflow.
63. [ ] **Documentation Generator:** `omni doc` command.
64. [ ] **Interactive Debugger:** Step-through debugging.
65. [ ] **Final Certification:** Release v1.5 candidate.
