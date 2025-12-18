# Developer Experience (DX) e Observabilidade

O Omni trata testes, debug e observabilidade não como ferramentas externas, mas como cidadãos de primeira classe embutidos na `Omni VM`.

---

## 1. Omni VM (`omni run`)

Para desenvolvimento rápido, não precisamos transpilar (o que pode ser lento). Usamos a **Omni VM (Virtual Machine)**.

- **JIT (Just-In-Time):** Executa código Omni instantaneamente na memória.
- **Mocking Automático:** Se o código pede um banco de dados pesado, a VM intercepta e oferece um SQLite em memória.
- **UI Virtual:** Renderiza interfaces gráficas num DOM Virtual na memória, permitindo testes sem abrir janelas ("Headless").

---

## 2. Flight Recorder (Caixa Preta)

Um sistema unificado de Tracing Distribuído Local. Acaba com o `print` desorganizado.

### Comandos de Debug

```rust
// Log estruturado (JSON com contexto)
log.info("Processando pagamento", { id: 123, valor: 50.00 });

// Snapshot (O "Print" Mágico)
// Backend: Dump de memória e variáveis.
// Frontend: Screenshot real da tela componente.
debug.snap("erro-no-calculo");

// Performance
debug.mark("inicio-loop");
// ... código ...
debug.measure("inicio-loop"); // Registra o tempo exato
```

---

## 3. Relatórios Automáticos (`omni-report.html`)

Ao rodar `omni test` ou `omni run --record`, o sistema gera um artefato HTML interativo pós-execução.

**O que contém no Relatório:**

1.  **Timeline Visual:** Linha do tempo de milissegundos mostrando interações Front-Back-Banco.
2.  **Galeria de Snapshots:** Carrossel com os `debug.snap()` tirados durante a execução. Captura o estado visual exato do erro.
3.  **Trace Híbrido:** Mostra a linha de erro no Omni e a linha correspondente no código compilado (ex: PHP/C++), facilitando o rastreio profundo.

---

## 4. Testes de Fluxo (`.flow`)

Arquivos de cenário de uso que rodam na Omni VM. Simulam um usuário real.

```rust
scenario "Login com Sucesso" {
    let tela = open(LoginScreen);

    debug.snap("tela-inicial"); // Tira foto pro relatório

    tela.input("user", "admin");
    tela.click("Entrar");

    assert(tela.route == "/dashboard");
    assert(http.last_response.code == 200);
}
```

Isso valida Frontend e Backend simultaneamente na mesma memória, em milissegundos.
