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

/// Itens de Nível Superior (Funções, Structs)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum TopLevelItem {
    Function(FunctionDeclaration),
    Struct(StructDeclaration),
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
    /// x = x + 1;
    Assignment {
        target: String,
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
    Add,       // +
    Subtract,  // -
    Multiply,  // *
    Divide,    // /
    Equals,    // ==
    NotEquals, // !=
    // ...
}
