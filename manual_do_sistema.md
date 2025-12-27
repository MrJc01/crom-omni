# Guia Definitivo do Sistema Crom-Omni

> **Para Iniciantes: Do Zero ao "Hello World" Universal**

Este guia foi criado para te ensinar **tudo** sobre o sistema Omni, assumindo que você está começando agora. Vamos desmistificar como essa tecnologia funciona, como escrever código nela e, principalmente, como testar cada uma de suas funcionalidades.

---

## 1. O Que é o Omni? (O Conceito Básico)

Imagine que você é um escritor. Hoje, se você quiser escrever um livro para brasileiros, você escreve em Português. Se quiser para americanos, precisa reescrever em Inglês. No mundo da programação é igual: para fazer sites usamos JavaScript, para Inteligência Artificial usamos Python, para sistemas rápidos usamos C++.

O **Omni** é como um "tradutor universal". Você escreve a lógica do seu programa **uma única vez** na linguagem Omni, e o sistema (o compilador) traduz automaticamente para:

- **JavaScript** (para rodar na Web ou Node.js)
- **Python** (para IA e scripts)
- **C/Rust** (futuramente, para máxima performance)

**A Filosofia:** "Soberania da Lógica". A sua regra de negócio não deve depender da tecnologia que vai rodá-la.

---

## 2. Preparando o Terreno (Instalação)

Antes de começar, você precisa ter as ferramentas certas. O Omni é construído em **Rust** (uma linguagem super rápida), então você precisa dela instalada.

### Passo a Passo:

1.  **Instale o Rust**: Se não tiver, procure por "Rustup" na internet e instale.
2.  **Clone o Projeto**: Baixe o código do Crom-Omni para sua máquina.
    ```bash
    git clone https://github.com/MrJc01/crom-omni.git
    cd crom-omni
    ```
3.  **Compile o Compilador** (Sim, parece redundante, mas você está construindo a ferramenta que vai construir seus programas):
    ```bash
    cd omnic
    cargo install --path .
    ```
    _Se tudo der certo, você terá o comando `omni` disponível no seu terminal._

---

## 3. A Linguagem Omni (Como Escrever)

A sintaxe (jeito de escrever) do Omni é uma mistura do melhor de dois mundos: a clareza do **C/Java** com a segurança do **Rust**. Chamamos isso de estilo **A+C**.

### Estrutura Básica

Todo programa Omni começa em um arquivo `.omni`.

```rust
// Definição de pacote (como pastas organizadoras)
package meu.programa;

// Função principal (onde tudo começa)
fn main() {
    print("Olá, Universo!");
}
```

### Variáveis e Tipos

O Omni gosta de segurança. Você diz o tipo da variável, ou ele adivinha se for óbvio.

```rust
// Variável Imutável (Não muda nunca - Padrão do Omni)
let nome: string = "Omni";

// Variável Mutável (Pode mudar)
mut contador: i64 = 0; // i64 = inteiro de 64 bits

// Tipos comuns:
// string  -> Texto
// i64     -> Número inteiro
// f64     -> Número com vírgula (decimal)
// bool    -> Verdadeiro ou Falso (true/false)
```

### Structs (Seus Dados)

Em vez de "Classes" complicadas, usamos "Structs" para definir a forma dos dados.

```rust
struct Usuario {
    nome: string,
    idade: i64,
    admin: bool
}
```

---

## 4. O Superpoder: "Onde Roda?" (Targets)

Aqui a mágica acontece. Você pode escolher onde seu código vai rodar na hora de compilar.

**Comando Mágico:** `omni build` ou `omni compile`

Exemplo prático:

1.  Salva o código acima como `teste.omni`.
2.  Roda no terminal:
    - `omni compile teste.omni --target js` -> Gera um arquivo `.js` pro Node.js.
    - `omni compile teste.omni --target python` -> Gera um arquivo `.py` pro Python.

O código-fonte é o mesmo, o resultado muda conforme sua necessidade.

### Túneis Nativos (`native`)

Às vezes você precisa fazer algo muito específico de uma linguagem (ex: mexer numa janela do Windows em C, ou no navegador em JS). O Omni deixa você "furar" a abstração.

```rust
fn fazer_algo_especifico() {
    native "js" {
        console.log("Estou rodando no Javascript!");
    }
    native "python" {
        print("Estou rodando no Python!")
    }
}
```

---

## 5. Como Testar TUDO (O Guia de Testes)

O projeto já vem com uma "Galeria de Exemplos" que serve como suite de testes. É a melhor forma de aprender e verificar se tudo está funcionando.

A pasta `examples/` contém arquivos numerados de 01 a 20, aumentando em complexidade.

### O Comando Mestre

Para testar se **todas** as funcionalidades do sistema estão operando corretamente, use o comando:

```powershell
.\omni test-all
```

Isso vai tentar compilar todos os 20 exemplos. Se todos passarem (verdinho), o sistema está 100%.

### Guia dos Exemplos (O que cada um ensina/testa)

Se quiser testar manualmente um por um para aprender, siga esta ordem:

#### Nível 1: O Básico (Fundamentos)

1.  **`01_hello_universal.omni`**: O clássico. Testa se o compilador consegue gerar JS e Python básicos.
2.  **`02_flow_control.omni`**: Testa `if`, `else`, `while` (loops e condições).
3.  **`03_capsule_architecture.omni`**: Testa como organizar código em módulos.
4.  **`04_types_and_structs.omni`**: Testa criação de tipos de dados personalizados.

#### Nível 2: Conectando com o Mundo

5.  **`05_http_api_client.omni`**: Testa fazer chamadas de API (Internet).
6.  **`06_file_system_master.omni`**: Testa ler e escrever arquivos no disco.
7.  **`07_json_transformer.omni`**: Testa mexer com JSON (formato de dados da web).
8.  **`08_native_bridge.omni`**: Testa os blocos `native` explicados acima.

#### Nível 3: Visual e 3D (O Diferencial do Omni)

O Omni tem um "Studio" visual. 9. **`09_basic_3d_cube.omni`**: Cria um cubo 3D. 10. **`10_animated_solar_system.omni`**: Uma animação complexa. 11. **`11_interactive_ui_nodes.omni`**: Testa a interface de nós visuais.

Para ver esses, use o comando: `.\omni studio examples/nome_do_arquivo.omni`

#### Nível 4: Sistemas Robustos

12. **`13_secure_hasher.omni`**: Criptografia.
13. **`14_sql_agnostic_query.omni`**: Banco de Dados (funciona com vários bancos).
14. **`15_p2p_mesh_node.omni`**: Redes (computadores conversando entre si).
15. **`16_background_worker.omni`**: Tarefas em segundo plano (multitarefa).

#### Nível 5: Showroom (Salles Completos)

16. **`17_mini_game_3d.omni`**: Um jogo completo!
17. **`18_payment_flow.omni`**: Um sistema de pagamentos.
18. **`19_legacy_converter_demo.omni`**: Converte código antigo para Omni.
19. **`20_omni_self_scan.omni`**: O Omni analisando o próprio código Omni (Metaprogramação).

---

## 6. Configuração Avançada (`omni.config.json`)

Para projetos reais, você não compila arquivo por arquivo. Você usa um arquivo de configuração chamado `omni.config.json`. Ele define:

- **Nome do Projeto**: Versão, autor.
- **Targets**: "Quero que o backend seja Python e o frontend seja React".
- **Profiles**: "No modo `dev` rode local, no modo `prod` rode na nuvem".

Quando você roda `omni build` na pasta do projeto, ele lê esse arquivo e faz toda a mágica.

---

## Resumo para o "Testador"

Para garantir que você sabe tudo:

1.  Clone e instale.
2.  Rode `.\omni test-all` para ver a saúde geral.
3.  Abra o arquivo `examples/01_hello_universal.omni`.
    - Tente mudar o texto.
    - Compile: `omni compile examples/01_hello_universal.omni --target js`.
    - Rode o resultado: `node output.js`.
4.  Vá avançando nos exemplos conforme sua curiosidade.

Bem-vindo ao Omni! 🪐
