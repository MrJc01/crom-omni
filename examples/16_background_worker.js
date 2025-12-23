function print(msg) {
     console.log(msg); 
}
class Task {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.payload = data.payload;
        this.status = data.status;
        this.result = data.result;
        this.error = data.error;
    }
}
class Worker {
    constructor(data = {}) {
        this.id = data.id;
        this.status = data.status;
        this.current_task = data.current_task;
        this.tasks_completed = data.tasks_completed;
    }
}
class WorkerPool {
    constructor(data = {}) {
        this.workers = data.workers;
        this.task_queue = data.task_queue;
        this.max_workers = data.max_workers;
        this.total_completed = data.total_completed;
    }
}
class TaskQueue {
    static queue = [];
    static processing = false;
    static enqueue(name, payload) {
    let task = new Task({ id: "", name: name, payload: payload, status: "pending", result: 0, error: "" });
    
            const crypto = require('crypto');
            task.id = crypto.randomBytes(4).toString('hex');
            TaskQueue.queue.push(task);
        
    return task;
}
    static dequeue() {
    let task = new Task({ id: "", name: "", payload: 0, status: "", result: 0, error: "" });
    
            const pending = TaskQueue.queue.find(t => t.status === 'pending');
            if (pending) {
                pending.status = 'running';
                task = pending;
            }
        
    return task;
}
    static complete(task_id, result) {
    
            const task = TaskQueue.queue.find(t => t.id === task_id);
            if (task) {
                task.status = 'completed';
                task.result = result;
            }
        
}
    static fail(task_id, error) {
    
            const task = TaskQueue.queue.find(t => t.id === task_id);
            if (task) {
                task.status = 'failed';
                task.error = error;
            }
        
}
    static length() {
    let len = 0;
    
            len = TaskQueue.queue.filter(t => t.status === 'pending').length;
        
    return len;
}
}

class Workers {
    static pool = new WorkerPool({ workers: [], task_queue: [], max_workers: 4, total_completed: 0 });
    static init(num_workers) {
    Workers.pool.max_workers = num_workers;
    
            const crypto = require('crypto');
            
            for (let i = 0; i < num_workers; i++) {
                const worker = {
                    id: 'worker-' + crypto.randomBytes(2).toString('hex'),
                    status: 'idle',
                    current_task: null,
                    tasks_completed: 0
                };
                Workers.pool.workers.push(worker);
            }
        
}
    static submit(name, handler, payload) {
    let task = TaskQueue.enqueue(name, payload);
    
            // Find idle worker
            const worker = Workers.pool.workers.find(w => w.status === 'idle');
            
            if (worker) {
                worker.status = 'busy';
                worker.current_task = task;
                
                // Simulate async execution
                setTimeout(() => {
                    try {
                        const result = handler(payload);
                        task.status = 'completed';
                        task.result = result;
                    } catch (e) {
                        task.status = 'failed';
                        task.error = e.message;
                    }
                    
                    worker.status = 'idle';
                    worker.current_task = null;
                    worker.tasks_completed++;
                    Workers.pool.total_completed++;
                }, 100);
            }
        
    return task;
}
    static submit_async(name, handler, payload) {
    let promise = 0;
    
            promise = new Promise((resolve, reject) => {
                const task = TaskQueue.enqueue(name, payload);
                
                const worker = Workers.pool.workers.find(w => w.status === 'idle');
                
                if (worker) {
                    worker.status = 'busy';
                    
                    setTimeout(() => {
                        try {
                            const result = handler(payload);
                            task.status = 'completed';
                            task.result = result;
                            worker.status = 'idle';
                            worker.tasks_completed++;
                            Workers.pool.total_completed++;
                            resolve(result);
                        } catch (e) {
                            task.status = 'failed';
                            task.error = e.message;
                            worker.status = 'idle';
                            reject(e);
                        }
                    }, 100);
                } else {
                    reject(new Error('No idle workers'));
                }
            });
        
    return promise;
}
    static status() {
    
            console.log('  Worker Pool Status:');
            console.log('    Total workers: ' + Workers.pool.workers.length);
            console.log('    Idle: ' + Workers.pool.workers.filter(w => w.status === 'idle').length);
            console.log('    Busy: ' + Workers.pool.workers.filter(w => w.status === 'busy').length);
            console.log('    Tasks completed: ' + Workers.pool.total_completed);
        
}
    static wait_all() {
    
            return new Promise(resolve => {
                const check = () => {
                    const busy = Workers.pool.workers.filter(w => w.status === 'busy').length;
                    if (busy === 0) {
                        resolve();
                    } else {
                        setTimeout(check, 50);
                    }
                };
                check();
            });
        
}
    static shutdown() {
    
            for (const worker of Workers.pool.workers) {
                worker.status = 'stopped';
            }
            Workers.pool.workers = [];
            console.log('  Worker pool shutdown complete');
        
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Background Workers          ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("1. Initializing worker pool...");
    Workers.init(4);
    print("   ✓ Created 4 workers");
    print("");
    Workers.status();
    print("");
    print("2. Submitting tasks...");
    
        // Define task handlers
        const fibonacci = (n) => {
            if (n <= 1) return n;
            return fibonacci(n - 1) + fibonacci(n - 2);
        };
        
        const factorial = (n) => {
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        };
        
        // Submit multiple tasks
        Workers.submit('fib(30)', fibonacci, 30);
        Workers.submit('fib(32)', fibonacci, 32);
        Workers.submit('factorial(10)', factorial, 10);
        Workers.submit('factorial(12)', factorial, 12);
    
    print("   ✓ Submitted 4 CPU-intensive tasks");
    print("");
    print("3. Worker status while processing...");
    Workers.status();
    print("");
    print("4. Waiting for completion...");
    
        Workers.wait_all().then(() => {
            console.log('   ✓ All tasks completed');
            console.log('');
            
            console.log('5. Final status:');
            Workers.status();
            console.log('');
            
            console.log('6. Shutting down...');
            Workers.shutdown();
            console.log('');
            
            console.log('Worker Pool API:');
            console.log('  Workers.init(n)              - Create n workers');
            console.log('  Workers.submit(name, fn, p)  - Submit task');
            console.log('  Workers.submit_async(...)    - Submit async task');
            console.log('  Workers.status()             - Show pool status');
            console.log('  Workers.wait_all()           - Wait for completion');
            console.log('  Workers.shutdown()           - Stop all workers');
            console.log('');
            
            console.log('✓ Background worker demo complete!');
        });
    
}

main();
