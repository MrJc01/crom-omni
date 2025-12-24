// Test script for parsing
try {
    require('./omni_bundle.js');
    
    const source = `fn hello() { print("Hi"); }`;
    
    console.log("TOKEN_RPAREN global:", global.TOKEN_RPAREN);
    console.log("TOKEN_RPAREN direct:", typeof TOKEN_RPAREN === 'undefined' ? 'undefined' : TOKEN_RPAREN);

    console.log("Creating lexer...");
    const l = new_lexer(source);
    console.log("Creating parser...");  
    const p = new_parser(l);
    console.log("Parsing program...");
    const program = Parser_parse_program(p);
    
    console.log("Statements:", program.statements.length);
} catch (e) {
    console.log("ERROR:", e.message);
    console.log("STACK:", e.stack);
}
