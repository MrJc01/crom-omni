BlockLoop: 66 (return)
const NODE_PROGRAM = 1;
const NODE_LET = 2;
const NODE_LITERAL = 3;
const NODE_FUNCTION = 4;
const NODE_BLOCK = 5;
const NODE_CALL = 6;
const NODE_RETURN = 7;
const NODE_BINARY = 8;
const NODE_MEMBER = 9;
const NODE_IMPORT = 10;
const NODE_ARRAY = 11;
const NODE_STRUCT_INIT = 12;
const NODE_IF = 13;
const NODE_WHILE = 14;
const NODE_IDENTIFIER = 15;
const NODE_ASSIGNMENT = 16;
const NODE_STRING = 17;
const NODE_BOOL = 18;
const NODE_STRUCT = 70;
const NODE_NATIVE = 80;
class Program {
    constructor(data = {}) {
        this.statements = data.statements;
    }
}
class AssignmentExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.left = data.left;
        this.right = data.right;
    }
}
class NativeStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.lang = data.lang;
        this.code = data.code;
    }
}
class LetStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.value = data.value;
        this.is_exported = data.is_exported;
    }
}
class ImportDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.path = data.path;
    }
}
class ExpressionStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.expr = data.expr;
    }
}
class IntegerLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class StringLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class BoolLiteral {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class StructInitExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.fields = data.fields;
    }
}
class StructInitField {
    constructor(data = {}) {
        this.name = data.name;
        this.value = data.value;
    }
}
class BinaryExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.left = data.left;
        this.op = data.op;
        this.right = data.right;
    }
}
class MemberExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.target = data.target;
        this.property = data.property;
    }
}
class FunctionDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.params = data.params;
        this.body = data.body;
        this.is_exported = data.is_exported;
        this.decorators = data.decorators;
    }
}
class Block {
    constructor(data = {}) {
        this.kind = data.kind;
        this.statements = data.statements;
    }
}
class CallExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.function = data.function;
        this.args = data.args;
    }
}
class ReturnStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}
class IfStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.condition = data.condition;
        this.consequence = data.consequence;
        this.alternative = data.alternative;
    }
}
class WhileStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.condition = data.condition;
        this.body = data.body;
    }
}
class StructDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.fields = data.fields;
        this.is_exported = data.is_exported;
        this.decorators = data.decorators;
    }
}
class StructField {
    constructor(data = {}) {
        this.name = data.name;
        this.typename = data.typename;
    }
}
class Decorator {
    constructor(data = {}) {
        this.name = data.name;
        this.args = data.args;
    }
}
function new_struct_field(name, typename) {
    return new StructField({ name: name, typename: typename });
}
class Identifier {
    constructor(data = {}) {
        this.kind = data.kind;
        this.value = data.value;
    }
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.new_struct_field = new_struct_field;
    exports.Program = Program;
    exports.AssignmentExpr = AssignmentExpr;
    exports.NativeStmt = NativeStmt;
    exports.LetStmt = LetStmt;
    exports.ImportDecl = ImportDecl;
    exports.ExpressionStmt = ExpressionStmt;
    exports.IntegerLiteral = IntegerLiteral;
    exports.StringLiteral = StringLiteral;
    exports.BoolLiteral = BoolLiteral;
    exports.StructInitExpr = StructInitExpr;
    exports.StructInitField = StructInitField;
    exports.BinaryExpr = BinaryExpr;
    exports.MemberExpr = MemberExpr;
    exports.FunctionDecl = FunctionDecl;
    exports.Block = Block;
    exports.CallExpr = CallExpr;
    exports.ReturnStmt = ReturnStmt;
    exports.IfStmt = IfStmt;
    exports.WhileStmt = WhileStmt;
    exports.StructDecl = StructDecl;
    exports.StructField = StructField;
    exports.Decorator = Decorator;
    exports.Identifier = Identifier;
    exports.NODE_PROGRAM = NODE_PROGRAM;
    exports.NODE_LET = NODE_LET;
    exports.NODE_LITERAL = NODE_LITERAL;
    exports.NODE_FUNCTION = NODE_FUNCTION;
    exports.NODE_BLOCK = NODE_BLOCK;
    exports.NODE_CALL = NODE_CALL;
    exports.NODE_RETURN = NODE_RETURN;
    exports.NODE_BINARY = NODE_BINARY;
    exports.NODE_MEMBER = NODE_MEMBER;
    exports.NODE_IMPORT = NODE_IMPORT;
    exports.NODE_ARRAY = NODE_ARRAY;
    exports.NODE_STRUCT_INIT = NODE_STRUCT_INIT;
    exports.NODE_IF = NODE_IF;
    exports.NODE_WHILE = NODE_WHILE;
    exports.NODE_IDENTIFIER = NODE_IDENTIFIER;
    exports.NODE_ASSIGNMENT = NODE_ASSIGNMENT;
    exports.NODE_STRING = NODE_STRING;
    exports.NODE_BOOL = NODE_BOOL;
    exports.NODE_STRUCT = NODE_STRUCT;
    exports.NODE_NATIVE = NODE_NATIVE;
}
