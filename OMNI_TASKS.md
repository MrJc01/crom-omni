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
    - [x] **Task 04.2.2: Memory Management in C:** Simple Reference Counting for structs (Stubbed for now in headers).
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
