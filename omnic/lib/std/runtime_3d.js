// =============================================================================
// Omni 3D Runtime (Three.js + ASCII Terminal Shim)
// =============================================================================

const _isBrowser = typeof window !== 'undefined';

// ASCII Renderer State
const _asciiState = {
    objects: [],
    camera: { x: 0, y: 0, z: 15 },
    width: 80,
    height: 24,
    running: false
};

// ANSI escape codes for terminal
const ESC = '\x1b';
const CLEAR = `${ESC}[2J${ESC}[H`;
const HIDE_CURSOR = `${ESC}[?25l`;
const SHOW_CURSOR = `${ESC}[?25h`;
const YELLOW = `${ESC}[33m`;
const BLUE = `${ESC}[34m`;
const WHITE = `${ESC}[37m`;
const RESET = `${ESC}[0m`;

function clearScreen() {
    process.stdout.write(CLEAR);
}

function moveCursor(x, y) {
    process.stdout.write(`${ESC}[${y};${x}H`);
}

function drawChar(x, y, char, color = WHITE) {
    if (x >= 0 && x < _asciiState.width && y >= 0 && y < _asciiState.height) {
        moveCursor(Math.floor(x) + 1, Math.floor(y) + 1);
        process.stdout.write(`${color}${char}${RESET}`);
    }
}

// Three.js CDN loader for browser
function ThreeJS_load(callback) {
    if (_isBrowser) {
        if (typeof THREE !== 'undefined') {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    } else {
        // Terminal ASCII Mode
        console.log('OMNI 3D ASCII RENDERER');
        process.stdout.write(HIDE_CURSOR);
        process.on('exit', () => process.stdout.write(SHOW_CURSOR));
        process.on('SIGINT', () => { process.stdout.write(SHOW_CURSOR); process.exit(); });
        callback();
    }
}

// Scene3D class
class Scene3D {
    constructor(opts = {}) {
        this.handle = opts.handle || 0;
        if (_isBrowser && typeof THREE !== 'undefined') {
            this._scene = new THREE.Scene();
        } else {
            this._scene = { type: 'Scene3D', children: [] };
        }
    }
}

// Camera3D class
class Camera3D {
    constructor(opts = {}) {
        this.handle = opts.handle || 0;
        if (_isBrowser && typeof THREE !== 'undefined') {
            this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        } else {
            this._camera = { type: 'Camera3D', position: { x: 0, y: 0, z: 15 } };
        }
    }
}

// Renderer3D class
class Renderer3D {
    constructor(opts = {}) {
        this.handle = opts.handle || 0;
        if (_isBrowser && typeof THREE !== 'undefined') {
            this._renderer = new THREE.WebGLRenderer();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        } else {
            this._renderer = { type: 'Renderer3D' };
        }
    }
}

// Mesh3D class
class Mesh3D {
    constructor(opts = {}) {
        this.handle = opts.handle || 0;
        this._mesh = null;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.radius = 1;
        this.color = 0xffffff;
        this.asciiColor = WHITE;
    }
}

function Scene_create() {
    return new Scene3D();
}

function Camera_create() {
    return new Camera3D();
}

function Renderer_create() {
    return new Renderer3D();
}

function Renderer_init(renderer) {
    if (_isBrowser && renderer._renderer && renderer._renderer.domElement) {
        document.body.appendChild(renderer._renderer.domElement);
    }
}

function Camera_set_z(camera, z) {
    if (camera._camera && camera._camera.position) {
        camera._camera.position.z = z;
    }
    _asciiState.camera.z = z;
}

function Sphere_create(radius, color, scene) {
    const mesh = new Mesh3D();
    mesh.radius = radius;
    mesh.color = color;
    
    // Determine ASCII color based on hex
    if (color > 0xffff00 - 100000 && color < 0xffff00 + 100000) mesh.asciiColor = YELLOW;
    else if (color > 0x0077ff - 100000 && color < 0x0077ff + 100000) mesh.asciiColor = BLUE;
    else mesh.asciiColor = WHITE;
    
    if (_isBrowser && typeof THREE !== 'undefined') {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
        mesh._mesh = new THREE.Mesh(geometry, material);
        if (scene._scene && scene._scene.add) {
            scene._scene.add(mesh._mesh);
        }
    }
    
    _asciiState.objects.push(mesh);
    return mesh;
}

function Mesh_set_position(mesh, x, y, z) {
    mesh.x = x;
    mesh.y = y;
    mesh.z = z;
    if (mesh._mesh && mesh._mesh.position) {
        mesh._mesh.position.set(x, y, z);
    }
}

function Renderer_render(renderer, scene, camera) {
    if (_isBrowser && renderer._renderer && scene._scene && camera._camera) {
        renderer._renderer.render(scene._scene, camera._camera);
    } else {
        // ASCII Render
        const centerX = _asciiState.width / 2;
        const centerY = _asciiState.height / 2;
        const scale = 3; // Scale factor for terminal
        
        // Clear and draw
        clearScreen();
        console.log('OMNI 3D ASCII RENDERER');
        console.log('');
        
        // Draw each object
        for (const obj of _asciiState.objects) {
            // Project 3D to 2D (simple orthographic)
            const screenX = centerX + obj.x * scale;
            const screenY = centerY - obj.z * scale * 0.5; // Y is inverted in terminal
            
            // Draw based on size
            const char = obj.radius > 1 ? 'O' : (obj.radius > 0.3 ? 'o' : '.');
            drawChar(screenX, screenY + 3, char, obj.asciiColor);
        }
        
        moveCursor(1, _asciiState.height);
    }
}

function AnimationLoop(callback) {
    if (_isBrowser) {
        function loop() {
            requestAnimationFrame(loop);
            callback();
        }
        loop();
    } else {
        // Terminal animation loop - runs forever until Ctrl+C
        _asciiState.running = true;
        
        // Handle Ctrl+C gracefully
        process.on('SIGINT', () => {
            _asciiState.running = false;
            clearScreen();
            console.log('\n[3D] Animation stopped by user.');
            process.stdout.write(SHOW_CURSOR);
            process.exit(0);
        });
        
        const interval = setInterval(() => {
            if (!_asciiState.running) {
                clearInterval(interval);
                return;
            }
            callback();
        }, 50); // 20 FPS
    }
}

// Math helpers
function cos(x) { return Math.cos(x); }
function sin(x) { return Math.sin(x); }

console.log('[3D] Omni 3D Runtime loaded successfully');
