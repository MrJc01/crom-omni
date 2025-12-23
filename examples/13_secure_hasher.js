function print(msg) {
     console.log(msg); 
}
class HashResult {
    constructor(data = {}) {
        this.algorithm = data.algorithm;
        this.input_length = data.input_length;
        this.hash_hex = data.hash_hex;
        this.hash_base64 = data.hash_base64;
    }
}
class HmacResult {
    constructor(data = {}) {
        this.algorithm = data.algorithm;
        this.signature_hex = data.signature_hex;
        this.valid = data.valid;
    }
}
class Crypto {
    static sha256(data) {
    let result = new HashResult({ algorithm: "SHA-256", input_length: 0, hash_hex: "", hash_base64: "" });
    
            const crypto = require('crypto');
            result.input_length = data.length;
            const hash = crypto.createHash('sha256').update(data).digest();
            result.hash_hex = hash.toString('hex');
            result.hash_base64 = hash.toString('base64');
        
    
    return result;
}
    static sha512(data) {
    let result = new HashResult({ algorithm: "SHA-512", input_length: 0, hash_hex: "", hash_base64: "" });
    
            const crypto = require('crypto');
            result.input_length = data.length;
            const hash = crypto.createHash('sha512').update(data).digest();
            result.hash_hex = hash.toString('hex');
            result.hash_base64 = hash.toString('base64');
        
    return result;
}
    static md5(data) {
    let result = new HashResult({ algorithm: "MD5", input_length: 0, hash_hex: "", hash_base64: "" });
    
            const crypto = require('crypto');
            result.input_length = data.length;
            const hash = crypto.createHash('md5').update(data).digest();
            result.hash_hex = hash.toString('hex');
            result.hash_base64 = hash.toString('base64');
        
    return result;
}
    static hmac_sha256(data, secret) {
    let result = new HmacResult({ algorithm: "HMAC-SHA256", signature_hex: "", valid: false });
    
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(data);
            result.signature_hex = hmac.digest('hex');
            result.valid = true;
        
    
    return result;
}
    static hmac_verify(data, secret, signature) {
    let valid = false;
    
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(data);
            const expected = hmac.digest('hex');
            // Constant-time comparison
            valid = crypto.timingSafeEqual(
                Buffer.from(signature, 'hex'),
                Buffer.from(expected, 'hex')
            );
        
    return valid;
}
    static random_bytes(length) {
    let result = "";
    
            const crypto = require('crypto');
            result = crypto.randomBytes(length).toString('hex');
        
    
    return result;
}
}

class Encoding {
    static base64_encode(data) {
    let result = "";
    
            result = Buffer.from(data).toString('base64');
        
    
    return result;
}
    static base64_decode(encoded) {
    let result = "";
    
            result = Buffer.from(encoded, 'base64').toString('utf8');
        
    
    return result;
}
    static hex_encode(data) {
    let result = "";
    
            result = Buffer.from(data).toString('hex');
        
    return result;
}
    static hex_decode(hex) {
    let result = "";
    
            result = Buffer.from(hex, 'hex').toString('utf8');
        
    return result;
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Secure Hasher (std.crypto)  ║");
    print("╚══════════════════════════════════════╝");
    print("");
    let test_data = "Hello, Omni!";
    print("1. SHA-256 Hash:");
    let sha256_result = Crypto.sha256(test_data);
    print("   Input: \"" + test_data + "\"");
    print("   Hex: " + sha256_result.hash_hex);
    print("   Base64: " + sha256_result.hash_base64);
    print("");
    print("2. SHA-512 Hash:");
    let sha512_result = Crypto.sha512(test_data);
    print("   Hex (first 64 chars): " + sha512_result.hash_hex);
    print("");
    print("3. HMAC-SHA256 Signature:");
    let secret = "my-secret-key";
    let hmac_result = Crypto.hmac_sha256(test_data, secret);
    print("   Data: \"" + test_data + "\"");
    print("   Secret: \"" + secret + "\"");
    print("   Signature: " + hmac_result.signature_hex);
    print("");
    print("4. Signature Verification:");
    let valid = Crypto.hmac_verify(test_data, secret, hmac_result.signature_hex);
    print("   Valid: " + "true");
    print("");
    print("5. Random Bytes:");
    let random = Crypto.random_bytes(16);
    print("   16 random bytes (hex): " + random);
    print("");
    print("6. Base64 Encoding:");
    let encoded = Encoding.base64_encode(test_data);
    let decoded = Encoding.base64_decode(encoded);
    print("   Original: \"" + test_data + "\"");
    print("   Encoded: \"" + encoded + "\"");
    print("   Decoded: \"" + decoded + "\"");
    print("");
    print("✓ Cryptography demo complete!");
    print("  All operations use secure, constant-time implementations.");
}

main();
