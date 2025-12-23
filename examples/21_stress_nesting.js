function evaluate_deep(value) {
    if (value == 1) {
    return "level_1";
} else {
    if (value == 2) {
    return "level_2";
} else {
    if (value == 3) {
    return "level_3";
} else {
    if (value == 4) {
    return "level_4";
} else {
    if (value == 5) {
    return "level_5";
} else {
    if (value == 6) {
    return "level_6";
} else {
    if (value == 7) {
    return "level_7";
} else {
    if (value == 8) {
    return "level_8";
} else {
    if (value == 9) {
    return "level_9";
} else {
    if (value == 10) {
    return "level_10";
} else {
    if (value == 11) {
    return "level_11";
} else {
    if (value == 12) {
    return "level_12";
} else {
    if (value == 13) {
    return "level_13";
} else {
    if (value == 14) {
    return "level_14";
} else {
    if (value == 15) {
    return "level_15";
} else {
    if (value == 16) {
    return "level_16";
} else {
    if (value == 17) {
    return "level_17";
} else {
    if (value == 18) {
    return "level_18";
} else {
    if (value == 19) {
    return "level_19";
} else {
    if (value == 20) {
    return "level_20";
} else {
    if (value == 21) {
    return "level_21";
} else {
    if (value == 22) {
    return "level_22";
} else {
    if (value == 23) {
    return "level_23";
} else {
    if (value == 24) {
    return "level_24";
} else {
    if (value == 25) {
    return "level_25";
} else {
    return "beyond";
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
function complex_boolean(a, b, c, d, e) {
    let result = a || b;
    // Unknown stmt kind: 0 type: number
    c || d;
    // Unknown stmt kind: 0 type: number
    e;
    let nested = a;
    null || c;
    d;
    // Unknown stmt kind: 0 type: number
    // Unknown stmt kind: 0 type: number
    // Unknown stmt kind: 0 type: number
    a || c(b || d);
    null || e;
    let chain = a;
    // Unknown stmt kind: 0 type: number
    b || c;
    // Unknown stmt kind: 0 type: number
    d || e;
    return result;
    // Unknown stmt kind: 0 type: number
    nested || chain;
}
function nested_loops() {
    let count = 0;
    let i = 0;
    while (i < 5) {
    let j = 0;
    while (j < 5) {
    let k = 0;
    while (k < 5) {
    let l = 0;
    while (l < 5) {
    let m = 0;
    while (m < 5) {
    count = count + 1;
    m = m + 1;
}
    l = l + 1;
}
    k = k + 1;
}
    j = j + 1;
}
    i = i + 1;
}
    return count;
}
function main() {
    
        console.log("=== Stress Test: Deep Nesting ===");
        console.log("Testing 25 levels of if/else nesting...");
        
        // Test each level
        for (let i = 1; i <= 26; i++) {
            const result = evaluate_deep(i);
            console.log("Level " + i + ": " + result);
        }
        
        console.log("");
        console.log("Testing boolean expressions...");
        const bool_result = complex_boolean(true, false, true, false, true);
        console.log("Complex boolean: " + bool_result);
        
        console.log("");
        console.log("Testing nested loops (5^5 iterations)...");
        const loop_count = nested_loops();
        console.log("Loop iterations: " + loop_count); // Should be 3125
        
        console.log("");
        console.log("✓ Stress test completed!");
    
}

main();
