function print(msg) {
     console.log(msg); 
}
class Vector3 {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
    }
}
class Color {
    constructor(data = {}) {
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
    }
}
class Transform {
    constructor(data = {}) {
        this.position = data.position;
        this.rotation = data.rotation;
        this.scale = data.scale;
    }
}
class Scene3D {
    constructor(data = {}) {
        this.handle = data.handle;
        this.camera = data.camera;
        this.renderer = data.renderer;
    }
}
class Mesh3D {
    constructor(data = {}) {
        this.handle = data.handle;
        this.transform = data.transform;
    }
}
class Light3D {
    constructor(data = {}) {
        this.handle = data.handle;
        this.intensity = data.intensity;
        this.color = data.color;
    }
}
class Engine3D {
    static scene = new Scene3D({ handle: 0, camera: 0, renderer: 0 });
    static meshes = [];
    static running = false;
    static init(width, height, bg_color) {
    
            // Create container
            const container = document.createElement('div');
            container.id = 'omni-3d-container';
            container.style.cssText = 'width:' + width + 'px;height:' + height + 'px;margin:auto;';
            document.body.appendChild(container);
            
            // Three.js setup
            const THREE = window.THREE;
            
            // Scene
            const sceneObj = new THREE.Scene();
            sceneObj.background = new THREE.Color(bg_color);
            
            // Camera
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;
            
            // Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            
            scene.handle = sceneObj;
            scene.camera = camera;
            scene.renderer = renderer;
        
    return scene;
}
    static create_cube(size, color) {
    let mesh = new Mesh3D({ handle: 0, transform: new Transform({ position: new Vector3({ x: 0.0, y: 0.0, z: 0.0 }), rotation: new Vector3({ x: 0.0, y: 0.0, z: 0.0 }), scale: new Vector3({ x: 1.0, y: 1.0, z: 1.0 }) }) });
    
            const THREE = window.THREE;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.3,
                roughness: 0.7
            });
            mesh.handle = new THREE.Mesh(geometry, material);
            scene.handle.add(mesh.handle);
            meshes.push(mesh);
        
    return mesh;
}
    static add_ambient_light(color, intensity) {
    let light = new Light3D({ handle: 0, intensity: intensity, color: new Color({ r: 1.0, g: 1.0, b: 1.0 }) });
    
            const THREE = window.THREE;
            light.handle = new THREE.AmbientLight(color, intensity);
            scene.handle.add(light.handle);
        
    return light;
}
    static add_directional_light(color, intensity, x, y, z) {
    let light = new Light3D({ handle: 0, intensity: intensity, color: new Color({ r: 1.0, g: 1.0, b: 1.0 }) });
    
            const THREE = window.THREE;
            const dirLight = new THREE.DirectionalLight(color, intensity);
            dirLight.position.set(x, y, z);
            light.handle = dirLight;
            scene.handle.add(dirLight);
        
    return light;
}
    static set_position(mesh, x, y, z) {
    mesh.transform.position.x = x;
    mesh.transform.position.y = y;
    mesh.transform.position.z = z;
    
            mesh.handle.position.set(x, y, z);
        
}
    static rotate(mesh, dx, dy, dz) {
    
            mesh.handle.rotation.x += dx;
            mesh.handle.rotation.y += dy;
            mesh.handle.rotation.z += dz;
        
}
    static start() {
    running = true;
    
            function animate() {
                if (!running) return;
                requestAnimationFrame(animate);
                
                // Rotate all meshes
                for (const mesh of meshes) {
                    mesh.handle.rotation.x += 0.01;
                    mesh.handle.rotation.y += 0.01;
                }
                
                scene.renderer.render(scene.handle, scene.camera);
            }
            animate();
        
}
    static stop() {
    running = false;
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Basic 3D Cube               ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("Creating 3D scene...");
    let scene = Engine3D.init(800, 600, "#1a1a2e");
    print("  ✓ Scene created (800x600)");
    Engine3D.add_ambient_light("#404040", 0.5);
    Engine3D.add_directional_light("#ffffff", 1.0, 5.0, 10.0, 7.5);
    print("  ✓ Lighting added");
    let cube = Engine3D.create_cube(2.0, "#58a6ff");
    print("  ✓ Cube created (size: 2.0, color: blue)");
    Engine3D.start();
    print("  ✓ Animation started");
    print("");
    print("Scene Structure:");
    print("  Engine3D.init()           - Create scene");
    print("  Engine3D.create_cube()    - Add cube mesh");
    print("  Engine3D.add_*_light()    - Add lighting");
    print("  Engine3D.start()          - Begin render loop");
    print("");
    print("✓ 3D cube demo running!");
    print("  Open in browser with Three.js to see the result.");
}
