let NODE_PROGRAM = 1;
let NODE_LET = 2;
let NODE_LITERAL = 3;
let NODE_FUNCTION = 4;
let NODE_BLOCK = 5;
let NODE_CALL = 6;
let NODE_RETURN = 7;
let NODE_BINARY = 8;
let NODE_MEMBER = 9;
let NODE_IMPORT = 10;
let NODE_ARRAY = 11;
let NODE_STRUCT_INIT = 12;
let NODE_IF = 13;
let NODE_WHILE = 14;
let NODE_IDENTIFIER = 15;
let NODE_ASSIGNMENT = 16;
let NODE_STRING = 17;
let NODE_BOOL = 18;
let NODE_FOR = 19;
let NODE_EXPRESSION_STMT = 20;
let NODE_UNARY = 21;
let NODE_STRUCT = 70;
let NODE_NATIVE = 80;
let NODE_CAPSULE = 90;
let NODE_SPAWN = 100;
let NODE_INTERFACE = 110;
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
class UnaryExpr {
    constructor(data = {}) {
        this.kind = data.kind;
        this.op = data.op;
        this.operand = data.operand;
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
class ForStmt {
    constructor(data = {}) {
        this.kind = data.kind;
        this.iterator = data.iterator;
        this.collection = data.collection;
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
class CapsuleDecl {
    constructor(data = {}) {
        this.kind = data.kind;
        this.name = data.name;
        this.body = data.body;
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

module.exports = { new_struct_field };

module.exports = Object.assign(module.exports || {}, { Program, AssignmentExpr, UnaryExpr, NativeStmt, LetStmt, ImportDecl, ExpressionStmt, IntegerLiteral, StringLiteral, BoolLiteral, StructInitExpr, StructInitField, BinaryExpr, MemberExpr, FunctionDecl, Block, CallExpr, ReturnStmt, IfStmt, WhileStmt, ForStmt, StructDecl, CapsuleDecl, StructField, Decorator, Identifier, NODE_PROGRAM, NODE_LET, NODE_LITERAL, NODE_FUNCTION, NODE_BLOCK, NODE_CALL, NODE_RETURN, NODE_BINARY, NODE_MEMBER, NODE_IMPORT, NODE_ARRAY, NODE_STRUCT_INIT, NODE_IF, NODE_WHILE, NODE_IDENTIFIER, NODE_ASSIGNMENT, NODE_STRING, NODE_BOOL, NODE_FOR, NODE_EXPRESSION_STMT, NODE_UNARY, NODE_STRUCT, NODE_NATIVE, NODE_CAPSULE, NODE_SPAWN, NODE_INTERFACE });
