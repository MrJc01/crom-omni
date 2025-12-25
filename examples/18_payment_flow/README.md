# Payment Flow

**Level 5: Showroom**

Payment system with interactive UI.

## Supported Modes

| Mode        | Supported  | What Happens                            |
| ----------- | ---------- | --------------------------------------- |
| `--cmd`     | ❌ No      | Browser required                        |
| `--app`     | ❌ No      | Needs browser                           |
| `--web`     | ✅ **Yes** | **Payment UI at http://localhost:3000** |
| `--web-app` | ✅ **Yes** | **Opens payment UI in browser**         |

## Run Commands

```powershell
.\omni run examples/18_payment_flow/src/main.omni --web
# Open: http://localhost:3000

.\omni run examples/18_payment_flow/src/main.omni --web-app
```

## What It Demonstrates

- Interactive web forms
- Payment processing simulation
- Audit logging
- Real-time UI updates
