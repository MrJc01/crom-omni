use std::iter::Peekable;
use crate::core::token::Token;
use crate::core::lexer::{Lexer, LexerError};
use crate::core::ast::*;
use anyhow::{Result, anyhow};

/// Parser Descendente Recursivo
/// Transforma Tokens -> AST
pub struct Parser<'a> {
    // Peekable permite olhar o próximo token sem consumir
    tokens: Peekable<Lexer<'a>>,
}

impl<'a> Parser<'a> {
    pub fn new(lexer: Lexer<'a>) -> Self {
        Self {
            tokens: lexer.peekable(),
        }
    }

    /// Ponto de Entrada: Parseia um Programa completo
    pub fn parse_program(&mut self) -> Result<Program> {
        let mut package = None;
        let mut imports = Vec::new();
        let mut items = Vec::new();

        while let Some(peeked) = self.tokens.peek() {
            match peeked {
                Ok((Token::Package, _)) => {
                    package = Some(self.parse_package()?);
                }
                Ok((Token::Import, _)) => {
                    imports.push(self.parse_import()?);
                }
                // Se não é package/import, vamos tentar itens ou EOF
                Ok(_) => {
                    // Tenta parsear itens de nível superior
                    match self.parse_top_level_item() {
                        Ok(item) => items.push(item),
                        Err(e) => return Err(e), // Propaga erro
                    }
                }
                Err(_) => {
                    // Erro do Lexer, consumimos pra evitar loop infinito ou estouramos o erro
                    self.consume()?; 
                }
            }
        }

        Ok(Program {
            package,
            imports,
            items,
        })
    }

    fn parse_package(&mut self) -> Result<String> {
        self.expect(Token::Package)?;
        let name = self.parse_identifier()?;
        // Suporte a nomes compostos com pontos? package com.foo;
        // Simplificado para MVP: package foo;
        self.expect(Token::Semicolon)?;
        Ok(name)
    }

    fn parse_import(&mut self) -> Result<Import> {
        self.expect(Token::Import)?;
        // Pode ser @std/foo ou identifier
        let path = match self.peek_token()? {
            Token::Attribute(s) => { self.consume()?; s } // @std...
            Token::Identifier(_) => self.parse_identifier()?,
            _ => return Err(anyhow!("Esperado caminho de importação")),
        };
        self.expect(Token::Semicolon)?;
        Ok(Import { path, alias: None })
    }

    fn parse_top_level_item(&mut self) -> Result<TopLevelItem> {
        // 1. Parsear Atributos (que vêm antes)
        let mut attributes = Vec::new();
        while let Ok(Token::Attribute(_)) = self.peek_token() {
             attributes.push(self.parse_attribute()?);
        }

        // 2. Identificar Struct ou Function
        let token = self.peek_token()?;
        match token {
            Token::Struct => {
                let mut decl = self.parse_struct()?;
                decl.attributes = attributes;
                Ok(TopLevelItem::Struct(decl))
            }
            Token::Fn => {
                let mut decl = self.parse_function()?;
                decl.attributes = attributes;
                Ok(TopLevelItem::Function(decl))
            }
            _ => Err(anyhow!("Esperado 'struct' ou 'fn' no nível superior (encontrado {:?})", token)),
        }
    }

    fn parse_attribute(&mut self) -> Result<Attribute> {
        // @nome
        let raw = self.expect_attribute()?; 
        // Remover o '@' do início para o nome
        let name = raw.trim_start_matches('@').to_string();
        
        // Parsear Parenteses Opcionais: @route("/path")
        let mut args = Vec::new();
        if let Ok(Token::ParenOpen) = self.peek_token() {
            self.consume()?;
            if let Ok(Token::ParenClose) = self.peek_token() {
                self.consume()?; // () vazio
            } else {
                // Argumentos
                loop {
                    args.push(self.parse_expression()?);
                    if let Ok(Token::Comma) = self.peek_token() {
                        self.consume()?;
                    } else {
                        break;
                    }
                }
                self.expect(Token::ParenClose)?;
            }
        }

        Ok(Attribute { name, args })
    }

    fn parse_struct(&mut self) -> Result<StructDeclaration> {
        self.expect(Token::Struct)?;
        let name = self.parse_identifier()?;
        self.expect(Token::BraceOpen)?;
        
        let mut fields = Vec::new();
        while self.peek_token()? != Token::BraceClose {
            let field_name = self.parse_identifier()?;
            self.expect(Token::Colon)?;
            let ty = self.parse_type()?;
            
            fields.push(StructField { name: field_name, ty });
            
            // Vírgula opcional no último item
            if let Ok(Token::Comma) = self.peek_token() {
                self.consume()?;
            }
        }
        self.expect(Token::BraceClose)?;
        
        Ok(StructDeclaration { name, fields, attributes: vec![] })
    }

    fn parse_function(&mut self) -> Result<FunctionDeclaration> {
        self.expect(Token::Fn)?;
        let name = self.parse_identifier()?;
        
        // Params (a: T, b: T)
        self.expect(Token::ParenOpen)?;
        let mut params = Vec::new();
        while self.peek_token()? != Token::ParenClose {
            let param_name = self.parse_identifier()?;
            self.expect(Token::Colon)?;
            let ty = self.parse_type()?;
            
            params.push(Param { name: param_name, ty });
            
            if let Ok(Token::Comma) = self.peek_token() {
                self.consume()?;
            }
        }
        self.expect(Token::ParenClose)?;

        // Return Type -> T (Opcional)
        let mut return_type = None;
        if let Ok(Token::Arrow) = self.peek_token() {
            self.consume()?;
            return_type = Some(self.parse_type()?);
        }

        // Body { ... }
        let body = self.parse_block()?;

        Ok(FunctionDeclaration {
            name,
            params,
            return_type,
            body,
            attributes: vec![],
            is_public: false, // TODO: Suportar pub
        })
    }

    fn parse_block(&mut self) -> Result<Block> {
        self.expect(Token::BraceOpen)?;
        let mut statements = Vec::new();

        while self.peek_token()? != Token::BraceClose {
            statements.push(self.parse_statement()?);
        }

        self.expect(Token::BraceClose)?;
        Ok(Block { statements })
    }

    fn parse_statement(&mut self) -> Result<Statement> {
        match self.peek_token()? {
            Token::Let | Token::Mut => self.parse_let_binding(),
            Token::Return => {
                self.consume()?;
                // Check if value (not semicolon)
                if self.peek_token()? == Token::Semicolon {
                    self.consume()?;
                    Ok(Statement::Return(None))
                } else {
                    let expr = self.parse_expression()?;
                    self.expect(Token::Semicolon)?;
                    Ok(Statement::Return(Some(expr)))
                }
            },
            Token::If => self.parse_if(),
            _ => {
                // Pode ser Assignment ou ExpressionStmt
                let expr = self.parse_expression()?;
                
                // Se logo após vier um '=', é Assignment
                if let Ok(Token::Assign) = self.peek_token() {
                    // Check if expression is Identifier to be valid assignment target
                    if let Expression::Identifier(name) = expr {
                        self.consume()?; // eat '='
                        let val = self.parse_expression()?;
                        self.expect(Token::Semicolon)?;
                        return Ok(Statement::Assignment { target: name, value: val });
                    }
                    return Err(anyhow!("Alvo de atribuição inválido"));
                }
                
                self.expect(Token::Semicolon)?;
                Ok(Statement::Expression(expr))
            }
        }
    }

    fn parse_let_binding(&mut self) -> Result<Statement> {
        let is_mut = if self.peek_token()? == Token::Mut {
            self.consume()?;
            true
        } else {
            self.consume()?; // let
            false
        };

        let name = self.parse_identifier()?;
        
        let mut ty = None;
        if let Ok(Token::Colon) = self.peek_token() {
            self.consume()?;
            ty = Some(self.parse_type()?);
        }

        self.expect(Token::Assign)?;
        let value = self.parse_expression()?;
        self.expect(Token::Semicolon)?;

        Ok(Statement::LetBinding { name, ty, value, is_mut })
    }

    fn parse_if(&mut self) -> Result<Statement> {
        self.expect(Token::If)?;
        // Parenteses opcionais no Omni mas vamos assumir que o usuário usa (cond) p/ MVP
        // Se usar sintaxe Rust 'if cond {', precisamos tratar. Vamos assumir 'if (cond) {' estilo C.
        self.expect(Token::ParenOpen)?;
        let condition = self.parse_expression()?;
        self.expect(Token::ParenClose)?;
        
        let then_branch = self.parse_block()?;
        let mut else_branch = None;
        
        if let Ok(Token::Else) = self.peek_token() {
            self.consume()?;
            else_branch = Some(self.parse_block()?);
        }

        Ok(Statement::If { condition, then_branch, else_branch })
    }

    // --- Parsing de Expressões (Recursive Descent com Níveis) ---

    // Nível Baixo (Equality): == !=
    fn parse_expression(&mut self) -> Result<Expression> {
        let mut left = self.parse_term()?; // + -

        while let Ok(token) = self.peek_token() {
            match token {
                Token::Equals => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Equals, right: Box::new(right) };
                },
                Token::NotEquals => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::NotEquals, right: Box::new(right) };
                },
                _ => break,
            }
        }
        Ok(left)
    }

    // Nível Médio (Additive): + -
    fn parse_term(&mut self) -> Result<Expression> {
        let mut left = self.parse_factor()?; // * /

        while let Ok(token) = self.peek_token() {
            match token {
                Token::Plus => {
                    self.consume()?;
                    let right = self.parse_factor()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Add, right: Box::new(right) };
                },
                Token::Minus => {
                    self.consume()?;
                    let right = self.parse_factor()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Subtract, right: Box::new(right) };
                },
                _ => break,
            }
        }
        Ok(left)
    }

    // Nível Alto (Multiplicative): * /
    fn parse_factor(&mut self) -> Result<Expression> {
        let mut left = self.parse_primary()?;

        while let Ok(token) = self.peek_token() {
            match token {
                Token::Star => {
                    self.consume()?;
                    let right = self.parse_primary()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Multiply, right: Box::new(right) };
                },
                Token::Slash => {
                    self.consume()?;
                    let right = self.parse_primary()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Divide, right: Box::new(right) };
                },
                _ => break,
            }
        }
        Ok(left)
    }

    // Nível Primário: Literais, Identificadores, Parenteses
    fn parse_primary(&mut self) -> Result<Expression> {
        match self.peek_token()? {
            Token::IntegerLiteral(i) => {
                self.consume()?;
                Ok(Expression::Literal(Literal::Integer(i)))
            },
            Token::StringLiteral(s) => {
                self.consume()?;
                Ok(Expression::Literal(Literal::String(s)))
            },
            Token::True => { self.consume()?; Ok(Expression::Literal(Literal::Bool(true))) },
            Token::False => { self.consume()?; Ok(Expression::Literal(Literal::Bool(false))) },
            Token::Identifier(s) => {
                self.consume()?;
                // Verificar se é chamada de função: nome(...)
                if let Ok(Token::ParenOpen) = self.peek_token() {
                   return self.parse_function_call(s);
                }
                Ok(Expression::Identifier(s))
            },
            Token::ParenOpen => {
                self.consume()?;
                let expr = self.parse_expression()?;
                self.expect(Token::ParenClose)?;
                Ok(expr)
            },
            t => Err(anyhow!("Token inesperado em expressão: {:?}", t)),
        }
    }

    fn parse_function_call(&mut self, name: String) -> Result<Expression> {
        self.expect(Token::ParenOpen)?;
        let mut args = Vec::new();
        if self.peek_token()? != Token::ParenClose {
             loop {
                 args.push(self.parse_expression()?);
                 if let Ok(Token::Comma) = self.peek_token() {
                     self.consume()?;
                 } else {
                     break;
                 }
             }
        }
        self.expect(Token::ParenClose)?;
        Ok(Expression::Call { function: Box::new(Expression::Identifier(name)), args })
    }

    fn parse_type(&mut self) -> Result<Type> {
        let name = self.parse_identifier()?;
        // Generics List<T>
        if let Ok(Token::Plus) = self.peek_token() { // TODO: Token::Lt (<) não está no TokenSet ainda, usando Placeholder
             // Para o MVP, tipos simples apenas.
             // Se precisar de Generics, precisa adicionar < > no Token e Lexer.
        }
        Ok(Type::Simple(name))
    }

    // --- Helpers ---

    fn parse_identifier(&mut self) -> Result<String> {
        match self.next_token()? {
            Token::Identifier(s) => Ok(s),
            t => Err(anyhow!("Esperado identificador, encontrado {:?}", t)),
        }
    }

    fn expect(&mut self, expected: Token) -> Result<()> {
        let t = self.next_token()?;
        if t == expected {
            Ok(())
        } else {
            Err(anyhow!("Esperado {:?}, encontrado {:?}", expected, t))
        }
    }

    fn expect_attribute(&mut self) -> Result<String> {
        match self.next_token()? {
            Token::Attribute(s) => Ok(s),
            t => Err(anyhow!("Esperado atributo, encontrado {:?}", t)),
        }
    }

    fn consume(&mut self) -> Result<Token> {
        self.next_token()
    }

    fn peek_token(&mut self) -> Result<Token> {
        match self.tokens.peek() {
            Some(Ok((token, _))) => Ok(token.clone()),
            Some(Err(e)) => Err(anyhow!("Erro Léxico: {}", e.message)),
            None => Err(anyhow!("Fim de arquivo inesperado")),
        }
    }

    fn next_token(&mut self) -> Result<Token> {
        match self.tokens.next() {
            Some(Ok((token, _))) => Ok(token),
            Some(Err(e)) => Err(anyhow!("Erro Léxico: {}", e.message)),
            None => Err(anyhow!("Fim de arquivo inesperado")),
        }
    }
}
