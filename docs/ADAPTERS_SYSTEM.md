# Sistema de Adapters (Fase 40)

> **Declare a Intenção. O Omni escolhe o Framework.**

## Conceito: Adapters Semânticos

Um **Adapter** é um conjunto de templates que traduzem fluxos lógicos abstratos em padrões de frameworks específicos. O desenvolvedor declara **O QUE** deseja (ex: "Renderizar Botão"), e o Omni injeta **COMO** fazer isso no framework configurado.

```
   Código Omni Abstrato          Adapter              Framework Alvo
   ┌─────────────────────┐    ┌──────────┐    ┌─────────────────────┐
   │ @ui.button("Click") │───▶│  React   │───▶│ <button>Click</button> │
   │ @server.get("/api") │───▶│  Next.js │───▶│ export GET = async() │
   └─────────────────────┘    └──────────┘    └─────────────────────┘
                                   │
                                   ▼ (troca de config)
                              ┌──────────┐    ┌─────────────────────┐
                              │  Laravel │───▶│ Route::get('/api')  │
                              └──────────┘    └─────────────────────┘
```

---

## UI Adapters

### Anotações Disponíveis

| Anotação        | Descrição                | React              | Svelte           | Laravel Blade      |
| --------------- | ------------------------ | ------------------ | ---------------- | ------------------ |
| `@ui.screen`    | Tela/Página completa     | Component + Layout | +page.svelte     | @extends('layout') |
| `@ui.component` | Componente reutilizável  | function Component | Component.svelte | @component         |
| `@ui.button`    | Botão interativo         | `<button>`         | `<button>`       | `<button>`         |
| `@ui.input`     | Campo de entrada         | `<input>`          | `<input>`        | `<input>`          |
| `@ui.list`      | Lista dinâmica           | `.map()`           | `{#each}`        | `@foreach`         |
| `@ui.if`        | Renderização condicional | `{cond && ...}`    | `{#if}`          | `@if`              |

### Exemplo: Código Agnóstico

```omni
@ui.screen("Dashboard")
capsule Dashboard {
    let users = [];

    @ui.list(items: users)
    fn renderUser(user: User) {
        @ui.card {
            @ui.text(user.name)
            @ui.button("Edit", action: editUser)
        }
    }
}
```

### Gerado para React

```tsx
export default function Dashboard() {
  const [users, setUsers] = useState([]);

  return (
    <div className="dashboard">
      {users.map((user) => (
        <Card key={user.id}>
          <Text>{user.name}</Text>
          <Button onClick={() => editUser(user)}>Edit</Button>
        </Card>
      ))}
    </div>
  );
}
```

### Gerado para Laravel Blade

```blade
@extends('layouts.app')

@section('content')
<div class="dashboard">
    @foreach($users as $user)
        <div class="card">
            <span>{{ $user->name }}</span>
            <button onclick="editUser({{ $user->id }})">Edit</button>
        </div>
    @endforeach
</div>
@endsection
```

---

## Server Adapters

### Anotações Disponíveis

| Anotação             | Descrição    | Express         | Next.js       | Laravel          | Django      |
| -------------------- | ------------ | --------------- | ------------- | ---------------- | ----------- |
| `@server.get`        | Rota GET     | `router.get()`  | `export GET`  | `Route::get()`   | `@api_view` |
| `@server.post`       | Rota POST    | `router.post()` | `export POST` | `Route::post()`  | `@api_view` |
| `@server.middleware` | Middleware   | `app.use()`     | middleware.ts | `->middleware()` | decorator   |
| `@server.auth`       | Autenticação | passport        | NextAuth      | Sanctum          | DRF Auth    |
| `@server.ws`         | WebSocket    | socket.io       | ws            | Pusher           | Channels    |

### Exemplo: API Route Agnóstica

```omni
capsule ProductAPI {
    @server.get("/products")
    flow listProducts() -> Product[] {
        return db.query("SELECT * FROM products");
    }

    @server.post("/products")
    @server.auth(role: "admin")
    flow createProduct(data: ProductInput) -> Product {
        return db.insert("products", data);
    }
}
```

### Gerado para Next.js (App Router)

```typescript
// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const products = await db.query("SELECT * FROM products");
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const product = await db.insert("products", data);
  return NextResponse.json(product);
}
```

### Gerado para Laravel

```php
// routes/api.php
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store'])->middleware('auth:sanctum', 'role:admin');

// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(ProductRequest $request)
    {
        return Product::create($request->validated());
    }
}
```

---

## Configuração de Adapters

### omni.config.json

```json
{
  "targets": {
    "web": {
      "language": "typescript",
      "framework": "nextjs",
      "ui_adapter": "tailwind-shadcn",
      "auth_adapter": "next-auth",
      "output": "dist/web"
    },
    "api": {
      "language": "python",
      "framework": "fastapi",
      "auth_adapter": "jwt",
      "output": "dist/api"
    },
    "mobile": {
      "language": "dart",
      "framework": "flutter",
      "ui_adapter": "material",
      "output": "dist/mobile"
    }
  },

  "adapters": {
    "ui": {
      "button": "shadcn/button",
      "input": "shadcn/input",
      "card": "shadcn/card"
    },
    "server": {
      "database": "prisma",
      "cache": "redis",
      "queue": "bullmq"
    }
  }
}
```

### Troca Instantânea

Para mudar de **Next.js** para **React + Vite**:

```json
{
  "targets": {
    "web": {
      "framework": "react-vite" // Era "nextjs"
    }
  }
}
```

Recompile. **Zero mudança no código Omni.**

---

## Arquitetura de Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                        CÓDIGO OMNI                              │
│  capsule, flow, @ui, @server, @entity                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ADAPTER LAYER                               │
│  UI Adapters (React, Vue, Flutter)                             │
│  Server Adapters (Express, FastAPI, Laravel)                   │
│  Data Adapters (Prisma, SQLAlchemy, Eloquent)                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LANGUAGE PROFILES                             │
│  TypeScript, Python, PHP, Dart, Lua, C                         │
│  (targets/js.json, targets/python.json, etc.)                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CÓDIGO GERADO                               │
│  React Components, API Routes, Controllers, Models             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Exemplo Completo: Full-Stack App

### Código Omni

```omni
@entity struct User {
    id: i64,
    name: string,
    email: string
}

@ui.screen("Users")
capsule UserManagement {
    let users: User[] = [];

    @server.get("/api/users")
    flow getUsers() -> User[] {
        return User.all();
    }

    @ui.list(items: users, render: renderUserCard)
    fn renderUserCard(user: User) {
        @ui.card {
            @ui.text(user.name)
            @ui.text(user.email)
        }
    }
}
```

### Config: Next.js

```json
{ "framework": "nextjs", "ui_adapter": "tailwind" }
```

**Gera:**

- `app/users/page.tsx` (React Component)
- `app/api/users/route.ts` (API Route)
- `prisma/schema.prisma` (User model)

### Config: Laravel

```json
{ "framework": "laravel", "ui_adapter": "blade" }
```

**Gera:**

- `resources/views/users.blade.php`
- `routes/api.php` + `UserController.php`
- `database/migrations/create_users_table.php`

---

## Por Que Adapters?

1. **Investimento em Lógica, não Framework:** Seu código sobrevive à obsolescência de bibliotecas.
2. **Migração Instantânea:** Troque Next.js por Astro, React por Vue, Express por Fastify.
3. **Equipe Unificada:** Frontend e Backend escrevem na mesma linguagem (Omni).
4. **Prototipagem Rápida:** Gere MVPs em qualquer stack instantaneamente.

_O Framework é um Detalhe de Implementação. A Lógica é Eterna._
