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
    // Referência ao source code bruto, necessário para extrair blocos nativos
    source: &'a str,
}

impl<'a> Parser<'a> {
    pub fn new(lexer: Lexer<'a>, source: &'a str) -> Self {
        Self {
            tokens: lexer.peekable(),
            source,
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
        // Simplificado para MVP: package foo;
        self.expect(Token::Semicolon)?;
        Ok(name)
    }

    fn parse_import(&mut self) -> Result<Import> {
        self.expect(Token::Import)?;
        // Pode ser @std/foo, identifier, ou string literal "path/to/file.omni"
        let path = match self.peek_token()? {
            Token::Attribute(s) => { self.consume()?; s } // @std...
            Token::Identifier(_) => self.parse_identifier()?,
            Token::StringLiteral(s) => { self.consume()?; s } // "path/to/file.omni"
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

        // 2. Identificar Struct, Function, ou Let
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
            Token::Let | Token::Mut => {
                // Parse top-level let binding
                let stmt = self.parse_let_binding()?;
                if let Statement::LetBinding { name, ty, value, is_mut } = stmt {
                    Ok(TopLevelItem::LetBinding { name, ty, value, is_mut })
                } else {
                    Err(anyhow!("Erro interno parsing let"))
                }
            }
            _ => Err(anyhow!("Esperado 'struct', 'fn' ou 'let' no nível superior (encontrado {:?})", token)),
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
            Token::While => self.parse_while(),
            Token::For => self.parse_for(),
            Token::Native => self.parse_native_block(),
            Token::Break => {
                self.consume()?;
                self.expect(Token::Semicolon)?;
                Ok(Statement::Break)
            },
            Token::Continue => {
                self.consume()?;
                self.expect(Token::Semicolon)?;
                Ok(Statement::Continue)
            },
            _ => {
                // Pode ser Assignment ou ExpressionStmt
                let expr = self.parse_expression()?;
                
                if let Ok(Token::Assign) = self.peek_token() {
                    self.consume()?; // eat '='
                    let val = self.parse_expression()?;
                    self.expect(Token::Semicolon)?;
                    
                    // Verify target is valid (Identifier or MemberAccess)
                    match &expr {
                        Expression::Identifier(_) | Expression::MemberAccess { .. } | Expression::Index { .. } => {},
                        _ => return Err(anyhow!("Alvo de atribuição inválido")),
                    };

                    return Ok(Statement::Assignment { target: expr, value: val });
                }
                
                self.expect(Token::Semicolon)?;
                Ok(Statement::Expression(expr))
            }
        }
    }

    fn parse_native_block(&mut self) -> Result<Statement> {
         self.expect(Token::Native)?;
         
         // Accept both native("js") {} and native "js" {} syntaxes
         let lang = if let Ok(Token::ParenOpen) = self.peek_token() {
             self.consume()?; // eat (
             let lang = match self.next_token()? {
                 Token::StringLiteral(s) => s,
                 t => return Err(anyhow!("Esperado string literal, achou {:?}", t)),
             };
             self.expect(Token::ParenClose)?;
             lang
         } else if let Ok(Token::StringLiteral(s)) = self.peek_token() {
             self.consume()?; // eat string
             s
         } else {
             return Err(anyhow!("Esperado '(' ou string literal após 'native'"));
         };
         
         // Consume opening brace and get its end position
         self.expect(Token::BraceOpen)?;
         
         // Get start position by looking at current lexer position
         // We need to find where the content starts (after the {)
         let start_pos = self.get_current_position();
         
         // Count braces to find matching close
         let mut depth = 1;
         let mut end_pos = start_pos;
         
         while let Some(res) = self.tokens.next() {
             match res {
                 Ok((Token::BraceOpen, span)) => {
                     depth += 1;
                     end_pos = span.end;
                 }
                 Ok((Token::BraceClose, span)) => {
                     depth -= 1;
                     if depth == 0 {
                         // Don't include the closing brace in the content
                         end_pos = span.start;
                         break;
                     }
                     end_pos = span.end;
                 }
                 Ok((_, span)) => {
                     end_pos = span.end;
                 }
                 Err(e) => {
                     // Continue even on lexer errors - we want raw content
                     // Just update position if we can get it from error
                     end_pos = e.span.end;
                 }
             }
         }
         
         // Extract raw source code between braces
         let raw_code = if start_pos < end_pos && end_pos <= self.source.len() {
             self.source[start_pos..end_pos].trim().to_string()
         } else {
             String::new()
         };
         
         Ok(Statement::NativeBlock { lang, code: vec![raw_code] })
    }
    
    /// Get current position in source (byte offset after last consumed token)
    fn get_current_position(&mut self) -> usize {
        // Peek at current token to get its start position
        match self.tokens.peek() {
            Some(Ok((_, span))) => span.start,
            _ => 0,
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
        self.expect(Token::ParenOpen)?;
        let condition = self.parse_expression()?;
        self.expect(Token::ParenClose)?;
        
        // Support both `if (cond) { block }` and `if (cond) statement;`
        let then_branch = if self.peek_token()? == Token::BraceOpen {
            self.parse_block()?
        } else {
            // Single statement form
            let stmt = self.parse_statement()?;
            Block { statements: vec![stmt] }
        };
        
        let mut else_branch = None;
        
        if let Ok(Token::Else) = self.peek_token() {
            self.consume()?;
            else_branch = Some(if self.peek_token()? == Token::BraceOpen {
                self.parse_block()?
            } else {
                let stmt = self.parse_statement()?;
                Block { statements: vec![stmt] }
            });
        }

        Ok(Statement::If { condition, then_branch, else_branch })
    }

    fn parse_while(&mut self) -> Result<Statement> {
        self.expect(Token::While)?;
        self.expect(Token::ParenOpen)?;
        let condition = self.parse_expression()?;
        self.expect(Token::ParenClose)?;
        
        let body = self.parse_block()?;
        Ok(Statement::While { condition, body })
    }

    fn parse_for(&mut self) -> Result<Statement> {
        self.expect(Token::For)?;
        self.expect(Token::ParenOpen)?;
        let var = self.parse_identifier()?;
        self.expect(Token::In)?;
        let iterator = self.parse_expression()?;
        self.expect(Token::ParenClose)?;
        
        let body = self.parse_block()?;
        Ok(Statement::For { var, iterator, body })
    }

    fn parse_expression(&mut self) -> Result<Expression> {
        let mut left = self.parse_term()?; 

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
                Token::LessThan => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::LessThan, right: Box::new(right) };
                },
                Token::GreaterThan => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::GreaterThan, right: Box::new(right) };
                },
                Token::LessEquals => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::LessEquals, right: Box::new(right) };
                },
                Token::GreaterEquals => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::GreaterEquals, right: Box::new(right) };
                },
                Token::LogicalAnd => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::LogicalAnd, right: Box::new(right) };
                },
                Token::LogicalOr => {
                    self.consume()?;
                    let right = self.parse_term()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::LogicalOr, right: Box::new(right) };
                },
                _ => break,
            }
        }
        Ok(left)
    }

    fn parse_term(&mut self) -> Result<Expression> {
        let mut left = self.parse_factor()?; 

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

    fn parse_factor(&mut self) -> Result<Expression> {
        let mut left = self.parse_primary_suffix()?; 

        while let Ok(token) = self.peek_token() {
            match token {
                Token::Star => {
                    self.consume()?;
                    let right = self.parse_primary_suffix()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Multiply, right: Box::new(right) };
                },
                Token::Slash => {
                    self.consume()?;
                    let right = self.parse_primary_suffix()?;
                    left = Expression::BinaryOp { left: Box::new(left), op: BinaryOperator::Divide, right: Box::new(right) };
                },
                _ => break,
            }
        }
        Ok(left)
    }

    fn parse_primary_suffix(&mut self) -> Result<Expression> {
        let mut expr = self.parse_base()?;

        loop {
            match self.peek_token() {
                Ok(Token::BracketOpen) => {
                    self.consume()?;
                    let index = self.parse_expression()?;
                    self.expect(Token::BracketClose)?;
                    expr = Expression::Index { target: Box::new(expr), index: Box::new(index) };
                },
                Ok(Token::ParenOpen) => {
                    self.consume()?;
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
                    expr = Expression::Call { function: Box::new(expr), args };
                },
                Ok(Token::BraceOpen) => {
                    // Struct instantiation: StructName { field: value, ... }
                    if let Expression::Identifier(name) = expr.clone() {
                        self.consume()?; // eat {
                        let mut fields = Vec::new();
                        while self.peek_token()? != Token::BraceClose {
                            let field_name = self.parse_identifier()?;
                            self.expect(Token::Colon)?;
                            let value = self.parse_expression()?;
                            fields.push(StructInitField { name: field_name, value });
                            if let Ok(Token::Comma) = self.peek_token() {
                                self.consume()?;
                            }
                        }
                        self.expect(Token::BraceClose)?;
                        expr = Expression::StructInit { name, fields };
                    } else {
                        break; // Not an identifier, can't be struct init
                    }
                },
                Ok(Token::Dot) => {
                    // Member access: obj.field
                    self.consume()?; // eat .
                    let member = self.parse_identifier()?;
                    expr = Expression::MemberAccess { 
                        object: Box::new(expr), 
                        member 
                    };
                },
                _ => break,
            }
        }
        Ok(expr)
    }

    fn parse_base(&mut self) -> Result<Expression> {
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
                Ok(Expression::Identifier(s))
            },
            Token::ParenOpen => {
                self.consume()?;
                let expr = self.parse_expression()?;
                self.expect(Token::ParenClose)?;
                Ok(expr)
            },
            Token::BracketOpen => {
                self.parse_array_literal()
            },
            t => Err(anyhow!("Token inesperado em expressão: {:?}", t)),
        }
    }

    fn parse_array_literal(&mut self) -> Result<Expression> {
        self.expect(Token::BracketOpen)?;
        let mut items = Vec::new();
        while self.peek_token()? != Token::BracketClose {
            items.push(self.parse_expression()?);
            if let Ok(Token::Comma) = self.peek_token() {
                self.consume()?;
            }
        }
        self.expect(Token::BracketClose)?;
        Ok(Expression::Array(items))
    }

    fn parse_type(&mut self) -> Result<Type> {
        let name = self.parse_identifier()?;
        if let Ok(Token::Plus) = self.peek_token() { 
        }
        Ok(Type::Simple(name))
    }

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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::core::lexer::Lexer;
    use crate::core::ast::{Statement, Expression};

    // Função auxiliar para facilitar os testes
    fn parse_code(code: &str) -> Vec<Statement> {
        let lexer = Lexer::new(code);
        let mut parser = Parser::new(lexer, code);
        let mut statements = Vec::new();
        
        while parser.peek_token().is_ok() {
             match parser.parse_statement() {
                 Ok(stmt) => statements.push(stmt),
                 Err(e) => panic!("Falha no parsing: {}", e),
             }
        }
        statements
    }

    #[test]
    fn test_parse_array() {
        let code = "let numeros = [1, 2, 3];";
        let ast = parse_code(code);

        // Verifica se gerou um Statement::LetBinding
        if let Statement::LetBinding { name, value, .. } = &ast[0] {
            assert_eq!(name, "numeros");
            // Verifica se o valor é uma Expression::Array
            if let Expression::Array(elements) = value {
                assert_eq!(elements.len(), 3);
            } else {
                panic!("Esperava Expression::Array, encontrou {:?}", value);
            }
        } else {
            panic!("Esperava Statement::LetBinding, encontrou {:?}", ast[0]);
        }
    }

    #[test]
    fn test_parse_while_loop() {
        let code = "while (x < 10) { x = x + 1; }";
        let ast = parse_code(code);

        // Verifica se identificou o While
        if let Statement::While { condition: _, body } = &ast[0] {
            assert!(!body.statements.is_empty());
        } else {
            panic!("Esperava Statement::While, encontrou {:?}", ast[0]);
        }
    }

    #[test]
    fn test_parse_native_block() {
        let code = "native \"js\" { console.log('ola'); }";
        let ast = parse_code(code);

        if let Statement::NativeBlock { lang, code: native_code } = &ast[0] {
            assert_eq!(lang, "js");
            // native_code é Vec<String>
            let full_code = native_code.join("");
            assert!(full_code.contains("console.log"));
        } else {
            panic!("Esperava Statement::NativeBlock, encontrou {:?}", ast[0]);
        }
    }
}
