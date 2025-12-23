function print(msg) {
     console.log(msg); 
}
class Vec3 {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
    }
}
class Player {
    constructor(data = {}) {
        this.position = data.position;
        this.velocity = data.velocity;
        this.size = data.size;
        this.color = data.color;
        this.mesh = data.mesh;
    }
}
class Collectible {
    constructor(data = {}) {
        this.position = data.position;
        this.size = data.size;
        this.color = data.color;
        this.collected = data.collected;
        this.mesh = data.mesh;
    }
}
class GameState {
    constructor(data = {}) {
        this.score = data.score;
        this.time_remaining = data.time_remaining;
        this.game_over = data.game_over;
        this.player = data.player;
        this.collectibles = data.collectibles;
    }
}
class Input {
    static keys = 0;
    static init() {
    
            Input.keys = {};
            document.addEventListener('keydown', e => Input.keys[e.key] = true);
            document.addEventListener('keyup', e => Input.keys[e.key] = false);
        
}
    static is_pressed(key) {
    let pressed = false;
    
            pressed = Input.keys[key] === true;
        
    return pressed;
}
}

class Game {
    static state = new GameState({ score: 0, time_remaining: 60.0, game_over: false, player: new Player({ position: new Vec3({ x: 0.0, y: 0.0, z: 0.0 }), velocity: new Vec3({ x: 0.0, y: 0.0, z: 0.0 }), size: 1.0, color: "#58a6ff", mesh: 0 }), collectibles: [] });
    static scene = 0;
    static camera = 0;
    static renderer = 0;
    static ui_score = 0;
    static ui_time = 0;
    static init(width, height) {
    
            const THREE = window.THREE;
            
            // Create container
            const container = document.createElement('div');
            container.id = 'game-container';
            container.style.cssText = 'width:' + width + 'px;height:' + height + 'px;margin:auto;position:relative;';
            document.body.appendChild(container);
            
            // Scene
            Game.scene = new THREE.Scene();
            Game.scene.background = new THREE.Color('#1a1a2e');
            
            // Camera
            Game.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            Game.camera.position.set(0, 10, 15);
            Game.camera.lookAt(0, 0, 0);
            
            // Renderer
            Game.renderer = new THREE.WebGLRenderer({ antialias: true });
            Game.renderer.setSize(width, height);
            container.appendChild(Game.renderer.domElement);
            
            // Lights
            const ambient = new THREE.AmbientLight(0x404040, 0.5);
            Game.scene.add(ambient);
            const directional = new THREE.DirectionalLight(0xffffff, 1);
            directional.position.set(5, 10, 7.5);
            Game.scene.add(directional);
            
            // Ground plane
            const groundGeom = new THREE.PlaneGeometry(20, 20);
            const groundMat = new THREE.MeshStandardMaterial({ color: 0x333344 });
            const ground = new THREE.Mesh(groundGeom, groundMat);
            ground.rotation.x = -Math.PI / 2;
            Game.scene.add(ground);
            
            // Player cube
            const playerGeom = new THREE.BoxGeometry(1, 1, 1);
            const playerMat = new THREE.MeshStandardMaterial({ color: Game.state.player.color });
            Game.state.player.mesh = new THREE.Mesh(playerGeom, playerMat);
            Game.state.player.mesh.position.y = 0.5;
            Game.scene.add(Game.state.player.mesh);
            
            // UI overlay
            const ui = document.createElement('div');
            ui.style.cssText = 'position:absolute;top:10px;left:10px;color:#fff;font-family:monospace;font-size:16px;';
            ui.innerHTML = '<div id="score">Score: 0</div><div id="time">Time: 60.0</div>';
            container.appendChild(ui);
            Game.ui_score = document.getElementById('score');
            Game.ui_time = document.getElementById('time');
        
    Input.init();
}
    static spawn_collectibles(count) {
    
            const THREE = window.THREE;
            
            for (let i = 0; i < count; i++) {
                const x = (Math.random() - 0.5) * 16;
                const z = (Math.random() - 0.5) * 16;
                
                const collectible = {
                    position: { x: x, y: 0.5, z: z },
                    size: 0.5,
                    color: '#7ee787',
                    collected: false,
                    mesh: null
                };
                
                const geom = new THREE.SphereGeometry(0.4, 16, 16);
                const mat = new THREE.MeshStandardMaterial({ 
                    color: collectible.color,
                    emissive: 0x224422
                });
                collectible.mesh = new THREE.Mesh(geom, mat);
                collectible.mesh.position.set(x, 0.5, z);
                Game.scene.add(collectible.mesh);
                
                Game.state.collectibles.push(collectible);
            }
        
}
    static check_collision(c) {
    let collided = false;
    
            const dx = Game.state.player.position.x - c.position.x;
            const dz = Game.state.player.position.z - c.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            collided = dist < (Game.state.player.size / 2 + c.size);
        
    return collided;
}
    static update(delta) {
    if (Game.state.game_over) {
    return 0;
}
    Game.state.time_remaining = Game.state.time_remaining - delta;
    if (Game.state.time_remaining <= 0.0) {
    Game.state.game_over = true;
    return 0;
}
    let speed = 8.0;
    
            Game.state.player.velocity.x = 0;
            Game.state.player.velocity.z = 0;
            
            if (Input.is_pressed('ArrowUp') || Input.is_pressed('w')) {
                Game.state.player.velocity.z = -speed;
            }
            if (Input.is_pressed('ArrowDown') || Input.is_pressed('s')) {
                Game.state.player.velocity.z = speed;
            }
            if (Input.is_pressed('ArrowLeft') || Input.is_pressed('a')) {
                Game.state.player.velocity.x = -speed;
            }
            if (Input.is_pressed('ArrowRight') || Input.is_pressed('d')) {
                Game.state.player.velocity.x = speed;
            }
            
            // Apply velocity
            Game.state.player.position.x += Game.state.player.velocity.x * delta;
            Game.state.player.position.z += Game.state.player.velocity.z * delta;
            
            // Clamp to bounds
            Game.state.player.position.x = Math.max(-9, Math.min(9, Game.state.player.position.x));
            Game.state.player.position.z = Math.max(-9, Math.min(9, Game.state.player.position.z));
            
            // Update mesh
            Game.state.player.mesh.position.x = Game.state.player.position.x;
            Game.state.player.mesh.position.z = Game.state.player.position.z;
            
            // Check collectibles
            for (const c of Game.state.collectibles) {
                if (!c.collected && Game.check_collision(c)) {
                    c.collected = true;
                    c.mesh.visible = false;
                    Game.state.score += 10;
                }
            }
            
            // Update UI
            Game.ui_score.textContent = 'Score: ' + Game.state.score;
            Game.ui_time.textContent = 'Time: ' + Game.state.time_remaining.toFixed(1);
        
    return 0;
}
    static render() {
    
            Game.renderer.render(Game.scene, Game.camera);
        
}
    static run() {
    
            let lastTime = 0;
            
            function gameLoop(time) {
                requestAnimationFrame(gameLoop);
                
                const delta = Math.min((time - lastTime) / 1000, 0.1);
                lastTime = time;
                
                Game.update(delta);
                Game.render();
                
                if (Game.state.game_over) {
                    const gameOver = document.createElement('div');
                    gameOver.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:32px;font-family:sans-serif;text-align:center;';
                    gameOver.innerHTML = 'GAME OVER<br>Score: ' + Game.state.score;
                    document.getElementById('game-container').appendChild(gameOver);
                    return; // Stop loop
                }
            }
            
            gameLoop(0);
        
}
}

function main() {
    print("╔══════════════════════════════════════╗");
    print("║   OMNI - Mini 3D Game                ║");
    print("╚══════════════════════════════════════╝");
    print("");
    print("Initializing game...");
    Game.init(800, 600);
    print("  ✓ Scene created");
    Game.spawn_collectibles(15);
    print("  ✓ Spawned 15 collectibles");
    print("");
    print("Controls:");
    print("  Arrow keys or WASD - Move player");
    print("  Collect green spheres for points!");
    print("  60 seconds to get the highest score");
    print("");
    print("Starting game...");
    Game.run();
    print("");
    print("Game Features:");
    print("  - Delta time game loop");
    print("  - Collision detection");
    print("  - Score tracking");
    print("  - Time limit");
    print("  - Keyboard input");
    print("");
    print("✓ Game running!");
}
