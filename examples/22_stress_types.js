class Vector2 {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
    }
}
class Vector3 {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
    }
}
class Vector4 {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.w = data.w;
    }
}
class Color {
    constructor(data = {}) {
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;
    }
}
class ColorF {
    constructor(data = {}) {
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;
    }
}
class Point {
    constructor(data = {}) {
        this.position = data.position;
        this.color = data.color;
    }
}
class Vertex {
    constructor(data = {}) {
        this.position = data.position;
        this.normal = data.normal;
        this.uv = data.uv;
        this.color = data.color;
    }
}
class Triangle {
    constructor(data = {}) {
        this.v0 = data.v0;
        this.v1 = data.v1;
        this.v2 = data.v2;
    }
}
class Quad {
    constructor(data = {}) {
        this.v0 = data.v0;
        this.v1 = data.v1;
        this.v2 = data.v2;
        this.v3 = data.v3;
    }
}
class BoundingBox {
    constructor(data = {}) {
        this.min = data.min;
        this.max = data.max;
        this.center = data.center;
    }
}
class BoundingSphere {
    constructor(data = {}) {
        this.center = data.center;
        this.radius = data.radius;
    }
}
class Transform {
    constructor(data = {}) {
        this.position = data.position;
        this.rotation = data.rotation;
        this.scale = data.scale;
    }
}
class Matrix3x3 {
    constructor(data = {}) {
        this.m00 = data.m00;
        this.m01 = data.m01;
        this.m02 = data.m02;
        this.m10 = data.m10;
        this.m11 = data.m11;
        this.m12 = data.m12;
        this.m20 = data.m20;
        this.m21 = data.m21;
        this.m22 = data.m22;
    }
}
class Matrix4x4 {
    constructor(data = {}) {
        this.m00 = data.m00;
        this.m01 = data.m01;
        this.m02 = data.m02;
        this.m03 = data.m03;
        this.m10 = data.m10;
        this.m11 = data.m11;
        this.m12 = data.m12;
        this.m13 = data.m13;
        this.m20 = data.m20;
        this.m21 = data.m21;
        this.m22 = data.m22;
        this.m23 = data.m23;
        this.m30 = data.m30;
        this.m31 = data.m31;
        this.m32 = data.m32;
        this.m33 = data.m33;
    }
}
class Quaternion {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.w = data.w;
    }
}
class Material {
    constructor(data = {}) {
        this.name = data.name;
        this.diffuse = data.diffuse;
        this.specular = data.specular;
        this.shininess = data.shininess;
        this.opacity = data.opacity;
    }
}
class Mesh {
    constructor(data = {}) {
        this.name = data.name;
        this.vertex_count = data.vertex_count;
        this.triangle_count = data.triangle_count;
        this.bounds = data.bounds;
    }
}
class SceneNode {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.transform = data.transform;
        this.visible = data.visible;
        this.layer = data.layer;
    }
}
class Camera {
    constructor(data = {}) {
        this.node = data.node;
        this.fov = data.fov;
        this.near_clip = data.near_clip;
        this.far_clip = data.far_clip;
        this.aspect_ratio = data.aspect_ratio;
    }
}
class Light {
    constructor(data = {}) {
        this.node = data.node;
        this.color = data.color;
        this.intensity = data.intensity;
        this.range = data.range;
        this.light_type = data.light_type;
    }
}
class Keyframe {
    constructor(data = {}) {
        this.time = data.time;
        this.value = data.value;
        this.in_tangent = data.in_tangent;
        this.out_tangent = data.out_tangent;
    }
}
class AnimationCurve {
    constructor(data = {}) {
        this.name = data.name;
        this.keyframe_count = data.keyframe_count;
        this.loop_mode = data.loop_mode;
    }
}
class AnimationClip {
    constructor(data = {}) {
        this.name = data.name;
        this.duration = data.duration;
        this.frame_rate = data.frame_rate;
        this.curve_count = data.curve_count;
    }
}
class Animator {
    constructor(data = {}) {
        this.current_clip = data.current_clip;
        this.speed = data.speed;
        this.playing = data.playing;
        this.time = data.time;
    }
}
class Rigidbody {
    constructor(data = {}) {
        this.mass = data.mass;
        this.drag = data.drag;
        this.angular_drag = data.angular_drag;
        this.use_gravity = data.use_gravity;
        this.is_kinematic = data.is_kinematic;
        this.velocity = data.velocity;
        this.angular_velocity = data.angular_velocity;
    }
}
class Collider {
    constructor(data = {}) {
        this.is_trigger = data.is_trigger;
        this.bounds = data.bounds;
        this.center = data.center;
    }
}
class BoxCollider {
    constructor(data = {}) {
        this.collider = data.collider;
        this.size = data.size;
    }
}
class SphereCollider {
    constructor(data = {}) {
        this.collider = data.collider;
        this.radius = data.radius;
    }
}
class CapsuleCollider {
    constructor(data = {}) {
        this.collider = data.collider;
        this.radius = data.radius;
        this.height = data.height;
        this.direction = data.direction;
    }
}
class RaycastHit {
    constructor(data = {}) {
        this.point = data.point;
        this.normal = data.normal;
        this.distance = data.distance;
        this.collider_id = data.collider_id;
    }
}
class UIRect {
    constructor(data = {}) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
    }
}
class UIElement {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.rect = data.rect;
        this.anchor = data.anchor;
        this.pivot = data.pivot;
        this.visible = data.visible;
    }
}
class UIButton {
    constructor(data = {}) {
        this.element = data.element;
        this.label = data.label;
        this.normal_color = data.normal_color;
        this.hover_color = data.hover_color;
        this.pressed_color = data.pressed_color;
    }
}
class UISlider {
    constructor(data = {}) {
        this.element = data.element;
        this.min_value = data.min_value;
        this.max_value = data.max_value;
        this.current_value = data.current_value;
    }
}
class UIText {
    constructor(data = {}) {
        this.element = data.element;
        this.text = data.text;
        this.font_size = data.font_size;
        this.color = data.color;
        this.alignment = data.alignment;
    }
}
class GameObject {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.tag = data.tag;
        this.layer = data.layer;
        this.active = data.active;
        this.transform = data.transform;
        this.bounds = data.bounds;
        this.parent_id = data.parent_id;
        this.child_count = data.child_count;
    }
}
class Component {
    constructor(data = {}) {
        this.id = data.id;
        this.type_name = data.type_name;
        this.enabled = data.enabled;
        this.game_object_id = data.game_object_id;
    }
}
class Scene {
    constructor(data = {}) {
        this.name = data.name;
        this.object_count = data.object_count;
        this.camera_count = data.camera_count;
        this.light_count = data.light_count;
        this.loaded = data.loaded;
    }
}
function create_default_transform() {
    let t = new Transform({ position: new Vector3({ x: 0.0, y: 0.0, z: 0.0 }), rotation: new Vector3({ x: 0.0, y: 0.0, z: 0.0 }), scale: new Vector3({ x: 1.0, y: 1.0, z: 1.0 }) });
    return t;
}
function create_unit_cube() {
    let box = new BoundingBox({ min: new Vector3({ x: -0.5, y: -0.5, z: -0.5 }), max: new Vector3({ x: 0.5, y: 0.5, z: 0.5 }), center: new Vector3({ x: 0.0, y: 0.0, z: 0.0 }) });
    return box;
}
function create_white_material() {
    let mat = new Material({ name: "White", diffuse: new ColorF({ r: 1.0, g: 1.0, b: 1.0, a: 1.0 }), specular: new ColorF({ r: 0.5, g: 0.5, b: 0.5, a: 1.0 }), shininess: 32.0, opacity: 1.0 });
    return mat;
}
function create_main_camera() {
    let cam = new Camera({ node: new SceneNode({ id: 1, name: "MainCamera", transform: create_default_transform(), visible: true, layer: 0 }), fov: 60.0, near_clip: 0.1, far_clip: 1000.0, aspect_ratio: 1.78 });
    return cam;
}
function count_struct_types() {
    return 38;
}
function main() {
    let struct_count = count_struct_types();
    
        console.log("=== Stress Test: Complex Type System ===");
        console.log("Total struct types defined: " + struct_count);
        console.log("");
        
        console.log("Creating instances...");
        
        const transform = create_default_transform();
        console.log("✓ Transform created: " + JSON.stringify(transform));
        
        const bounds = create_unit_cube();
        console.log("✓ BoundingBox created: " + JSON.stringify(bounds));
        
        const material = create_white_material();
        console.log("✓ Material created: " + material.name);
        
        const camera = create_main_camera();
        console.log("✓ Camera created: " + camera.node.name + " (FOV: " + camera.fov + ")");
        
        console.log("");
        console.log("Type categories:");
        console.log("  - Base Types: 5 (Vector2, Vector3, Vector4, Color, ColorF)");
        console.log("  - Geometry: 6 (Point, Vertex, Triangle, Quad, BoundingBox, BoundingSphere)");
        console.log("  - Transform: 4 (Transform, Matrix3x3, Matrix4x4, Quaternion)");
        console.log("  - Scene Graph: 5 (Material, Mesh, SceneNode, Camera, Light)");
        console.log("  - Animation: 4 (Keyframe, AnimationCurve, AnimationClip, Animator)");
        console.log("  - Physics: 6 (Rigidbody, Collider, BoxCollider, SphereCollider, CapsuleCollider, RaycastHit)");
        console.log("  - UI: 5 (UIRect, UIElement, UIButton, UISlider, UIText)");
        console.log("  - Core: 3 (GameObject, Component, Scene)");
        console.log("");
        console.log("✓ Type stress test completed: " + struct_count + " structs parsed!");
    
}

main();
