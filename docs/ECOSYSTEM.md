# Ecossistema Omni: Modularidade Radical

O Omni adota uma filosofia de **"Core Oco"** (_Hollow Core_). A linguagem em si é mínima. Todo o poder vem de um sistema robusto de módulos, blueprints e um registro descentralizado.

---

## 1. Filosofia "Core Oco"

Diferente de linguagens como Python ou Go que vêm com "baterias inclusas" (e inchadas), o Omni sabe apenas fazer matemática, lógica básica e chamar interfaces.

- **Vantagem:** O compilador nunca envelhece. Se surgir o "HTTP/4", você atualiza a biblioteca, não a linguagem.
- **Interfaces Canônicas:** O Omni define o _contrato_ (ex: `interface Http`), mas não a _implementação_.

### Exemplo

```rust
// Código do Usuário
import @std/http; // Importa a Interface

fn main() {
    // A implementação real (Node? C++? PHP?) é injetada pelo Blueprint no build
    http.get("https://google.com");
}
```

---

## 2. Blueprints (Arquétipos)

Blueprints são "receitas de bolo" configuráveis para iniciar projetos ou configurar ambientes. Eles resolvem o "Paradoxo do Bootstrap" (como começar se a linguagem não tem nada?).

Um Blueprint define:

1.  **Libs Padrão:** Quais bibliotecas usar para HTTP, Banco de Dados, UI.
2.  **Configurações:** Targets padrão, regras de lint, configurações de infra.
3.  **Estrutura de Pastas:** Esqueleto inicial do projeto.

### Exemplo de Blueprint (`game-2d.json`)

Ao rodar `omni init --blueprint game-2d`, o Omni baixa:

```json
{
  "name": "Game 2D Starter",
  "libs": {
    "graphics": "omni-community/gpu-vulkan@opt", // Lib otimizada
    "physics": "omni-physics/newton-dynamics"
  },
  "targets_default": {
    "desktop": { "language": "c++", "mode": "native" },
    "web": { "language": "wasm" }
  }
}
```

Isso permite que um iniciante comece com um stack profissional sem configurar nada, enquanto um expert pode criar seu blueprint `custom-high-performance`.

---

## 3. Omni Registry Descentralizado

Onde as bibliotecas e blueprints vivem.

- **Segurança:** Bibliotecas são assinadas criptograficamente.
- **Verificação de Compatibilidade:** O Registry sabe quais versões de bibliotecas funcionam com quais Targets.
  - _Exemplo:_ A lib `omni-win32-api` só instala se o target for Windows.
- **Modo Offline:** O Omni faz cache local "congelado" de tudo que você precisa. Se a internet cair (ou a Omni Corp falir), seu projeto continua compilando para sempre.

### Funcionamento do `omni install`

1.  O compilador consulta o `omni.config`.
2.  Verifica os Targets ativos (ex: PHP 8.1 e Android).
3.  Baixa as implementações da biblioteca compatíveis com AMBOS os targets, ou avisa se houver conflito.
