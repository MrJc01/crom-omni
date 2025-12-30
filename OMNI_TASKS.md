# OMNI_TASKS.md - Cross-Platform Validation Matrix

## Status Legend

- ⬜ Pending
- 🔄 In Progress
- ✅ Passed
- ❌ Failed (needs fix)
- ⚠️ Partial (works with warnings)

---

## Phase 1: Universal CRUD Test Project

| Task                                       | Status | Notes                         |
| ------------------------------------------ | ------ | ----------------------------- |
| Create `examples/universal_crud/main.omni` | ✅     | Struct + Flow + UI components |

---

## Phase 2: Target Compilation Matrix

### Test File: `examples/universal_crud/main.omni`

| Target               | Command                                         | Status | Error Location             | Fix Applied                 |
| -------------------- | ----------------------------------------------- | ------ | -------------------------- | --------------------------- |
| **Native (Win x64)** | `omni run main.omni --type native`              | ⬜     | -                          | -                           |
| **Python**           | `omni run main.omni --type python`              | ⬜     | -                          | -                           |
| **Tauri 2.0**        | `omni run main.omni --type tauri`               | ⬜     | -                          | -                           |
| **React/JSX**        | `omni run main.omni --type react`               | ⬜     | -                          | -                           |
| **Laravel**          | `omni run main.omni --target-framework laravel` | ⬜     | -                          | -                           |
| Target               | Command                                         | Status | Error Location             | Fix Applied                 |
| -------------------- | ----------------------------------------------- | ------ | --------------             | ------------------------    |
| **Native (Win x64)** | `omni run main.omni --type native`              | ⚠️     | pywebview requires display | N/A (works with display)    |
| **Python**           | `omni run main.omni --type python`              | ⬜     | -                          | -                           |
| **Tauri 2.0**        | `omni run main.omni --type tauri`               | ✅     | -                          | Scaffolds `temp_tauri_app/` |
| **React/JSX**        | `omni run main.omni --type react`               | ⬜     | -                          | -                           |
| **Laravel**          | `omni run main.omni --target-framework laravel` | ✅     | -                          | Controller + Migration      |
| **Yii2**             | `omni run main.omni --target-framework yii2`    | ⬜     | -                          | -                           |
| **CMD (Node.js)**    | `omni run main.omni --cmd`                      | ✅     | -                          | Generates and runs JS       |

---

## Phase 3: Hub Stress Test

| Target        | Command                                        | Status | Notes |
| ------------- | ---------------------------------------------- | ------ | ----- |
| Hub → Native  | `omni run hub.omni --type native`              | ⬜     | -     |
| Hub → Web     | `omni run hub.omni --type web`                 | ⬜     | -     |
| Hub → Laravel | `omni run hub.omni --target-framework laravel` | ⬜     | -     |

---

## Compiler Fixes Log

| Date       | Error                                     | Module                    | Fix Description                        |
| ---------- | ----------------------------------------- | ------------------------- | -------------------------------------- |
| 2025-12-30 | `to_string` undefined                     | `targets/python.rs`       | Added `to_string()` helper function    |
| 2025-12-30 | `native_loader.py` hardcoded `index.html` | `core/packager.rs`        | Dynamic HTML filename from source file |
| 2025-12-30 | Missing `--type python`                   | `main.rs` + `packager.rs` | Added `Python` enum variant + handler  |

---

## Success Criteria

- [ ] 4+ environments pass without critical errors
- [ ] Domain logic remains identical across all targets
- [ ] No "dirty" code generation (warnings addressed)
