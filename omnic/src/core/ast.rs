use serde::{Serialize, Deserialize};

/// AST Root
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Program {
    pub package: Option<String>, // package com.example;
    pub imports: Vec<Import>,    // import std;
    pub items: Vec<TopLevelItem>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Import {
    pub path: String, // "std/http" ou "modulos.usuario"
    pub alias: Option<String>,
}

/// Itens de Nível Superior (Funções, Structs, Let, Capsule, Flow)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum TopLevelItem {
    Function(FunctionDeclaration),
    Struct(StructDeclaration),
    Capsule(CapsuleDeclaration),
    Flow(FlowDeclaration),
    LetBinding {
        name: String,
        ty: Option<Type>,
        value: Expression,
        is_mut: bool,
    },
}

/// Declaração de Função
/// fn nome(arg: T) -> R { ... }
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FunctionDeclaration {
    pub name: String,
    pub params: Vec<Param>,
    pub return_type: Option<Type>,
    pub body: Block,
    pub attributes: Vec<Attribute>, // @route, @test
    pub is_public: bool, // pub fn ...
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Param {
    pub name: String,
    pub ty: Type,
}

/// Declaração de Struct
/// struct User { id: i64 }
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StructDeclaration {
    pub name: String,
    pub fields: Vec<StructField>,
    pub attributes: Vec<Attribute>, // @entity
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StructField {
    pub name: String,
    pub ty: Type,
}

/// Atributos / Decorators
/// @route("/api", method: "GET")
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Attribute {
    pub name: String,
    pub args: Vec<Expression>, // Simplificado para lista de expr
}

/// Declaração de Cápsula (namespace/módulo)
/// capsule UserModule { fn ... struct ... }
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CapsuleDeclaration {
    pub name: String,
    pub items: Vec<TopLevelItem>,
    pub attributes: Vec<Attribute>,
}

/// Declaração de Flow (pipeline de processamento)
/// flow ProcessData(input: Data) -> Result { ... }
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FlowDeclaration {
    pub name: String,
    pub params: Vec<Param>,
    pub return_type: Option<Type>,
    pub body: Block,
    pub attributes: Vec<Attribute>,
}

/// Tipos da Linguagem
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Type {
    Simple(String), // i64, String, bool, User
    List(Box<Type>), // List<T>
    // Map, Tuple, etc no futuro
}

/// Blocos de Código { stmt1; stmt2; }
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Block {
    pub statements: Vec<Statement>,
}

/// Instruções (Statements)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Statement {
    /// let x: i32 = 10;
    LetBinding {
        name: String,
        ty: Option<Type>,
        value: Expression,
        is_mut: bool,
    },
    /// x = x + 1; or l.ch = value;
    Assignment {
        target: Expression,  // Changed from String to Expression for member access support
        value: Expression,
    },
    /// return x;
    Return(Option<Expression>),
    
    /// if (cond) { ... } else { ... }
    If {
        condition: Expression,
        then_branch: Block,
        else_branch: Option<Block>,
    },
    
    /// while (cond) { ... }
    While {
        condition: Expression,
        body: Block,
    },

    /// for (item in lista) { ... }
    For {
        var: String,
        iterator: Expression,
        body: Block,
    },

    /// Bloco Nativo para Fuga de Abstração
    /// native("js") { console.log(x); }
    NativeBlock {
        lang: String,
        code: Vec<String>, // Linhas de código
    },

    Break,
    Continue,
    
    /// Chamada solta ou expressão como statement
    Expression(Expression),
}

/// Expressões (Cálculos que retornam valor)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Expression {
    Literal(Literal),
    Identifier(String),
    
    /// Operações Binárias (1 + 2)
    BinaryOp {
        left: Box<Expression>,
        op: BinaryOperator,
        right: Box<Expression>,
    },
    
    /// Chamada de Função: print("Oi")
    Call {
        function: Box<Expression>, // Pode ser identificador ou acesso (obj.method)
        args: Vec<Expression>,
    },
    
    /// Array Literal [1, 2, 3]
    Array(Vec<Expression>),

    /// Index Access target[index]
    Index {
        target: Box<Expression>,
        index: Box<Expression>,
    },
    
    /// Struct Instantiation: Token { kind: 1, lexeme: "foo" }
    StructInit {
        name: String,
        fields: Vec<StructInitField>,
    },
    
    /// Member Access: obj.field
    MemberAccess {
        object: Box<Expression>,
        member: String,
    },

    /// Object Literal { key: value }
    ObjectLiteral(Vec<StructInitField>),
}

/// Field in a struct instantiation
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StructInitField {
    pub name: String,
    pub value: Expression,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Literal {
    Integer(i64),
    Float(f64),
    String(String),
    Bool(bool),
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum BinaryOperator {
    Add,           // +
    Subtract,      // -
    Multiply,      // *
    Divide,        // /
    Equals,        // ==
    NotEquals,     // !=
    LessThan,      // <
    GreaterThan,   // >
    LessEquals,    // <=
    GreaterEquals, // >=
    LogicalAnd,    // &&
    LogicalOr,     // ||
}
