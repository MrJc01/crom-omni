TOKEN_EOF = 0
TOKEN_ILLEGAL = 1
TOKEN_IDENTIFIER = 10
TOKEN_INT = 11
TOKEN_STRING = 12
TOKEN_ASSIGN = 20
TOKEN_PLUS = 21
TOKEN_MINUS = 22
TOKEN_BANG = 23
TOKEN_ASTERISK = 24
TOKEN_SLASH = 25
TOKEN_LT = 26
TOKEN_GT = 27
TOKEN_EQ = 28
TOKEN_NOT_EQ = 29
TOKEN_COLON = 30
TOKEN_DOT = 31
TOKEN_AND = 32
TOKEN_OR = 33
TOKEN_LE = 34
TOKEN_GE = 35
TOKEN_COMMA = 40
TOKEN_SEMICOLON = 41
TOKEN_LPAREN = 42
TOKEN_RPAREN = 43
TOKEN_LBRACE = 44
TOKEN_RBRACE = 45
TOKEN_LBRACKET = 46
TOKEN_RBRACKET = 47
TOKEN_FN = 60
TOKEN_LET = 61
TOKEN_TRUE = 62
TOKEN_FALSE = 63
TOKEN_IF = 64
TOKEN_ELSE = 65
TOKEN_RETURN = 66
TOKEN_WHILE = 67
TOKEN_STRUCT = 70
TOKEN_NATIVE = 80
TOKEN_IMPORT = 90
TOKEN_PACKAGE = 91
class Token:
    def __init__(self, data=None):
        if data is None: data = {}
        self.kind = data.get('kind')
        self.lexeme = data.get('lexeme')
        self.line = data.get('line')
        self.start = data.get('start')
        self.end = data.get('end')


    def new_token(kind, lexeme, line):
        return Token({ 'kind': kind, 'lexeme': lexeme, 'line': line, 'start': 0, 'end': 0 })

