# Adapters Showcase

**Level 5: Showroom**

Demonstrates `@ui`, `@server`, `@entity` decorators for framework-agnostic code.

## The Adapter Philosophy

> **Declare Intent. Omni Chooses the Framework.**

Instead of writing React or Laravel code, you write **semantic Omni code**:

```omni
@entity struct User { id: i64, name: string }

@server.get("/users")
fn listUsers() -> User[] { ... }

@ui.button("Click Me", action: handleClick)
fn handleClick() { ... }
```

Omni then generates the correct code for your target framework.

## Supported Modes

| Mode        | Supported  | What Happens               |
| ----------- | ---------- | -------------------------- |
| `--cmd`     | ✅ Yes     | Shows decorator analysis   |
| `--app`     | ❌ No      | Terminal only              |
| `--web`     | ⚠️ Limited | Simulates decorator output |
| `--web-app` | ❌ No      | Terminal only              |

## Run Command

```powershell
.\omni run examples/25_adapters_showcase/src/main.omni --cmd
```

## Key Decorators

| Decorator      | Purpose        | Generates                    |
| -------------- | -------------- | ---------------------------- |
| `@entity`      | Data model     | Prisma, Eloquent, SQLAlchemy |
| `@server.get`  | GET route      | Express, FastAPI, Laravel    |
| `@server.post` | POST route     | Express, FastAPI, Laravel    |
| `@ui.screen`   | Page/Screen    | React, Svelte, Blade         |
| `@ui.button`   | Button         | Button component             |
| `@ui.list`     | List rendering | map(), foreach, each         |
