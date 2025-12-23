function print(msg) {
     console.log(msg); 
}
class CelestialBody {
    constructor(data = {}) {
        this.name = data.name;
        this.radius = data.radius;
        this.color = data.color;
        this.orbit_radius = data.orbit_radius;
        this.orbit_speed = data.orbit_speed;
        this.rotation_speed = data.rotation_speed;
        this.mesh_handle = data.mesh_handle;
    }
}
class SolarSystem {
    constructor(data = {}) {
        this.sun = data.sun;
        this.planets = data.planets;
        this.scene = data.scene;
        this.camera = data.camera;
        this.renderer = data.renderer;
        this.time = data.time;
    }
}
class Solar {
    static system = new SolarSystem({ sun: new CelestialBody({ name: "", radius: 0.0, color: "", orbit_radius: 0.0, orbit_speed: 0.0, rotation_speed: 0.0, mesh_handle: 0 }), planets: [], scene: 0, camera: 0, renderer: 0, time: 0.0 });
    static init(width, height) {
    
            const THREE = window.THREE;
            
            // Container
            const container = document.createElement('div');
            container.id = 'solar-system';
            container.style.cssText = 'width:' + width + 'px;height:' + height + 'px;margin:auto;background:#000;';
            document.body.appendChild(container);
            
            // Scene
            Solar.system.scene = new THREE.Scene();
            
            // Camera (positioned to view the system)
            Solar.system.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            Solar.system.camera.position.set(0, 30, 50);
            Solar.system.camera.lookAt(0, 0, 0);
            
            // Renderer
            Solar.system.renderer = new THREE.WebGLRenderer({ antialias: true });
            Solar.system.renderer.setSize(width, height);
            container.appendChild(Solar.system.renderer.domElement);
            
            // Starfield background
            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
            const starVertices = [];
            for (let i = 0; i < 10000; i++) {
                const x = (Math.random() - 0.5) * 200;
                const y = (Math.random() - 0.5) * 200;
                const z = (Math.random() - 0.5) * 200;
                starVertices.push(x, y, z);
            }
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const stars = new THREE.Points(starGeometry, starMaterial);
            Solar.system.scene.add(stars);
            
            // Ambient light
            const ambient = new THREE.AmbientLight(0x333333);
            Solar.system.scene.add(ambient);
        
    print("  ✓ Solar system initialized");
}
    static create_sun() {
    Solar.system.sun = new CelestialBody({ name: "Sun", radius: 3.0, color: "#ffdd00", orbit_radius: 0.0, orbit_speed: 0.0, rotation_speed: 0.002, mesh_handle: 0 });
    
            const THREE = window.THREE;
            
            // Sun geometry with emissive material
            const geometry = new THREE.SphereGeometry(Solar.system.sun.radius, 32, 32);
            const material = new THREE.MeshBasicMaterial({ 
                color: Solar.system.sun.color,
                emissive: Solar.system.sun.color
            });
            Solar.system.sun.mesh_handle = new THREE.Mesh(geometry, material);
            Solar.system.scene.add(Solar.system.sun.mesh_handle);
            
            // Sun point light
            const sunLight = new THREE.PointLight(0xffffff, 2, 100);
            sunLight.position.set(0, 0, 0);
            Solar.system.scene.add(sunLight);
        
    print("  ✓ Sun created");
}
    static add_planet(name, radius, color, orbit_radius, orbit_speed) {
    let planet = new CelestialBody({ name: name, radius: radius, color: color, orbit_radius: orbit_radius, orbit_speed: orbit_speed, rotation_speed: 0.01, mesh_handle: 0 });
    
            const THREE = window.THREE;
            
            // Planet sphere
            const geometry = new THREE.SphereGeometry(radius, 24, 24);
            const material = new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.2,
                roughness: 0.8
            });
            planet.mesh_handle = new THREE.Mesh(geometry, material);
            planet.mesh_handle.position.x = orbit_radius;
            Solar.system.scene.add(planet.mesh_handle);
            
            // Orbit ring (visual guide)
            const orbitGeometry = new THREE.RingGeometry(orbit_radius - 0.05, orbit_radius + 0.05, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x444444, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            Solar.system.scene.add(orbit);
            
            Solar.system.planets.push(planet);
        
    print("  ✓ Planet added: " + name);
    return planet;
}
    static update(delta) {
    Solar.system.time = Solar.system.time + delta;
    
            // Rotate sun
            if (Solar.system.sun.mesh_handle) {
                Solar.system.sun.mesh_handle.rotation.y += Solar.system.sun.rotation_speed;
            }
            
            // Orbit planets
            for (const planet of Solar.system.planets) {
                const angle = Solar.system.time * planet.orbit_speed;
                planet.mesh_handle.position.x = Math.cos(angle) * planet.orbit_radius;
                planet.mesh_handle.position.z = Math.sin(angle) * planet.orbit_radius;
                planet.mesh_handle.rotation.y += planet.rotation_speed;
            }
        
}
    static render() {
    
            Solar.system.renderer.render(Solar.system.scene, Solar.system.camera);
        
}
    static start() {
    
            let lastTime = 0;
            function animate(time) {
                requestAnimationFrame(animate);
                const delta = (time - lastTime) / 1000;
                lastTime = time;
                
                Solar.update(delta);
                Solar.render();
            }
            animate(0);
        
    print("  ✓ Animation started");
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Animated Solar System       ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("Creating solar system...");
    Solar.init(900, 600);
    Solar.create_sun();
    Solar.add_planet("Mercury", 0.3, "#a0a0a0", 6.0, 0.8);
    Solar.add_planet("Venus", 0.5, "#e6c47a", 9.0, 0.6);
    Solar.add_planet("Earth", 0.5, "#6b93d6", 12.0, 0.5);
    Solar.add_planet("Mars", 0.4, "#c1440e", 16.0, 0.4);
    Solar.add_planet("Jupiter", 1.2, "#d8ca9d", 22.0, 0.2);
    Solar.add_planet("Saturn", 1.0, "#f4d59e", 28.0, 0.15);
    Solar.add_planet("Uranus", 0.7, "#d1e7e7", 34.0, 0.1);
    Solar.add_planet("Neptune", 0.7, "#5b5ddf", 40.0, 0.08);
    print("");
    Solar.start();
    print("");
    print("Solar System Features:");
    print("  - Realistic orbital speeds");
    print("  - Planet rotation");
    print("  - Orbit path visualization");
    print("  - Starfield background");
    print("  - Point light from sun");
    print("");
    print("✓ Solar system simulation running!");
}
