function heavy_task(n) {
    print("Processing task: " + n);
    return n * n;
}
function main() {
    print("Starting parallel tasks...");
    (() => {
    const { Worker, isMainThread } = require('worker_threads');
    const worker = new Worker(__filename, {
        workerData: { fn: 'unknown', args: [1] }
    });
    worker.on('message', result => console.log('[spawn] unknown done:', result));
    worker.on('error', err => console.error('[spawn] unknown error:', err));
})()
    // Unknown stmt kind: 0
    (() => {
    const { Worker, isMainThread } = require('worker_threads');
    const worker = new Worker(__filename, {
        workerData: { fn: 'unknown', args: [2] }
    });
    worker.on('message', result => console.log('[spawn] unknown done:', result));
    worker.on('error', err => console.error('[spawn] unknown error:', err));
})()
    // Unknown stmt kind: 0
    (() => {
    const { Worker, isMainThread } = require('worker_threads');
    const worker = new Worker(__filename, {
        workerData: { fn: 'unknown', args: [3] }
    });
    worker.on('message', result => console.log('[spawn] unknown done:', result));
    worker.on('error', err => console.error('[spawn] unknown error:', err));
})()
    // Unknown stmt kind: 0
    (() => {
    const { Worker, isMainThread } = require('worker_threads');
    const worker = new Worker(__filename, {
        workerData: { fn: 'unknown', args: [4] }
    });
    worker.on('message', result => console.log('[spawn] unknown done:', result));
    worker.on('error', err => console.error('[spawn] unknown error:', err));
})()
    // Unknown stmt kind: 0
    (() => {
    const { Worker, isMainThread } = require('worker_threads');
    const worker = new Worker(__filename, {
        workerData: { fn: 'unknown', args: [5] }
    });
    worker.on('message', result => console.log('[spawn] unknown done:', result));
    worker.on('error', err => console.error('[spawn] unknown error:', err));
})()
    // Unknown stmt kind: 0
    print("All tasks spawned!");
}
