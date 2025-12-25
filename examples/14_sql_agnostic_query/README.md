# SQL Agnostic Query

**Level 4: Systems & Networks**

Database abstraction layer.

## Supported Modes

| Mode        | Supported | What Happens                 |
| ----------- | --------- | ---------------------------- |
| `--cmd`     | ✅ Yes    | Generates SQL, prints output |
| `--app`     | ❌ No     | Terminal only                |
| `--web`     | ❌ No     | Terminal only                |
| `--web-app` | ❌ No     | Terminal only                |

## Run Command

```powershell
.\omni run examples/14_sql_agnostic_query/src/main.omni --cmd
```

## What It Demonstrates

- Query builder pattern
- SQL generation
- Database abstraction (same code for SQLite, PostgreSQL, MySQL)
