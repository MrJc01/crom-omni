function print(msg) {
     console.log(msg); 
}
class DataPacket {
    constructor(data = {}) {
        this.id = data.id;
        this.payload = data.payload;
        this.timestamp = data.timestamp;
        this.processed = data.processed;
    }
}
class TransformResult {
    constructor(data = {}) {
        this.original_id = data.original_id;
        this.transformed_payload = data.transformed_payload;
        this.steps_applied = data.steps_applied;
    }
}
class InputNode {
    static output_buffer = [];
    static generate(count) {
    let packets = [];
    let i = 0;
    while (i < count) {
    let packet = new DataPacket({ id: i + 1, payload: "data_" + "item", timestamp: "", processed: false });
    
                packet.timestamp = new Date().toISOString();
                packets.push(packet);
            
    i = i + 1;
}
    i = i + 1;
}
}

static emit_single() {
    
        native "js" {
            if (InputNode.output_buffer.length > 0) {
                return InputNode.output_buffer.shift();
            }
        }
        return DataPacket { id: 0, payload: "", timestamp: "", processed: false };
    
}
class TransformNode {
    static transform_count = 0;
    static uppercase(packet) {
    TransformNode.transform_count = TransformNode.transform_count + 1;
    let result = new TransformResult({ original_id: packet.id, transformed_payload: "", steps_applied: 1 });
    
            result.transformed_payload = packet.payload.toUpperCase();
        
    return result;
}
    static reverse(packet) {
    TransformNode.transform_count = TransformNode.transform_count + 1;
    let result = new TransformResult({ original_id: packet.id, transformed_payload: "", steps_applied: 1 });
    
            result.transformed_payload = packet.payload.split('').reverse().join('');
        
    return result;
}
    static chain(input, transform_name) {
    TransformNode.transform_count = TransformNode.transform_count + 1;
    input.steps_applied = input.steps_applied + 1;
    
            if (transform_name === 'hash') {
                input.transformed_payload = '#' + input.transformed_payload + '#';
            } else if (transform_name === 'bracket') {
                input.transformed_payload = '[' + input.transformed_payload + ']';
            }
        
    return input;
}
}

class OutputNode {
    static received = [];
    static collect(result) {
    static collect(result) {
    
            OutputNode.received.push(result);
        
}
    static log_all() {
    static log_all() {
    
            console.log("--- Collected Results ---");
            for (const r of OutputNode.received) {
                console.log("  [" + r.original_id + "] " + r.transformed_payload + " (steps: " + r.steps_applied + ")");
            }
            console.log("--- End ---");
        
}
}
    static count() {
    let c = 0;
    let c = 0;
    
            c = OutputNode.received.length;
        
    return c;
}
}
}

