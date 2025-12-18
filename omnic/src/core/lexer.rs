use logos::{Logos, SpannedIter};
use crate::core::token::Token;
use std::ops::Range;

// Tipo de Erro Léxico
#[derive(Debug, Clone)]
pub struct LexerError {
    pub message: String,
    pub span: Range<usize>,
}

// Estrutura do Lexer que envolve o logos
pub struct Lexer<'a> {
    inner: SpannedIter<'a, Token>,
    source: &'a str,
}

impl<'a> Lexer<'a> {
    pub fn new(source: &'a str) -> Self {
        Self {
            inner: Token::lexer(source).spanned(),
            source,
        }
    }
}

// Implementação de Iterator para facilitar o uso no Parser
impl<'a> Iterator for Lexer<'a> {
    type Item = Result<(Token, Range<usize>), LexerError>;

    fn next(&mut self) -> Option<Self::Item> {
        match self.inner.next() {
            Some((Ok(token), span)) => Some(Ok((token, span))),
            
            // Logos retorna Err(()) quando não consegue match
            Some((Err(_), span)) => {
                let invalid_char = &self.source[span.clone()];
                Some(Err(LexerError {
                    message: format!("Caractere inválido ou desconhecido: '{}'", invalid_char),
                    span,
                }))
            }
            
            None => None,
        }
    }
}

// Função helper para tokenizar tudo de uma vez (útil para debug CLI)
pub fn tokenize_all(source: &str) -> Vec<Result<(Token, Range<usize>), LexerError>> {
    let lexer = Lexer::new(source);
    lexer.collect()
}
