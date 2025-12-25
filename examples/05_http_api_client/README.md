# HTTP API Client

**Level 2: Integration**

Demonstrates HTTP requests with std.http.

## Supported Modes

| Mode        | Supported  | What Happens                        |
| ----------- | ---------- | ----------------------------------- |
| `--cmd`     | ✅ Yes     | Makes HTTP request, prints response |
| `--app`     | ❌ No      | Terminal only                       |
| `--web`     | ⚠️ Limited | Runs but output in console          |
| `--web-app` | ❌ No      | Not recommended                     |

## Run Command

```powershell
.\omni run examples/05_http_api_client/src/main.omni --cmd
```

## What It Demonstrates

- HTTP GET requests
- JSON response handling
- Network I/O abstraction
