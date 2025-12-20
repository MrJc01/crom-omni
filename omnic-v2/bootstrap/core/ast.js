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
    }
}
class StructField {
    constructor(data = {}) {
        this.name = data.name;
        this.typename = data.typename;
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

// --- [Bootstrap Auto-Patch] ---
// Exporta símbolos para require()
module.exports = { Program, AssignmentExpr, NativeStmt, LetStmt, ImportDecl, ExpressionStmt, IntegerLiteral, BinaryExpr, MemberExpr, FunctionDecl, Block, CallExpr, ReturnStmt, IfStmt, WhileStmt, StructDecl, StructField, Identifier, new_struct_field, NODE_PROGRAM, NODE_LET, NODE_LITERAL, NODE_FUNCTION, NODE_BLOCK, NODE_CALL, NODE_RETURN, NODE_BINARY, NODE_MEMBER, NODE_IMPORT, NODE_ARRAY, NODE_STRUCT_INIT, NODE_IF, NODE_WHILE, NODE_IDENTIFIER, NODE_ASSIGNMENT, NODE_STRUCT, NODE_NATIVE };

// Injeta no Global para simular o namespace plano do Omni
Object.assign(global, module.exports);
