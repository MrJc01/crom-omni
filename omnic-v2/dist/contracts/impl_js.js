const types = require("./types.js");
if (typeof global !== 'undefined') Object.assign(global, types);
function register_js_impl(registry) {
    
        registry.implementations['js'] = {
            'std.io.print': 'console.log({0})',
            'std.io.println': 'console.log({0})',
            'std.io.input': 'require("readline-sync").question({0})',
            'std.io.error': 'console.error({0})',
            
            'std.fs.read_file': 'require("fs").readFileSync({0}, "utf-8")',
            'std.fs.write_file': 'require("fs").writeFileSync({0}, {1})',
            'std.fs.exists': 'require("fs").existsSync({0})',
            'std.fs.delete': 'require("fs").unlinkSync({0})',
            'std.fs.list_dir': 'require("fs").readdirSync({0})',
            'std.fs.mkdir': 'require("fs").mkdirSync({0}, { recursive: true })',
            
            'std.http.get': 'await fetch({0}).then(r => r.json())',
            'std.http.post': 'await fetch({0}, { method: "POST", body: JSON.stringify({1}) }).then(r => r.json())',
            'std.http.put': 'await fetch({0}, { method: "PUT", body: JSON.stringify({1}) }).then(r => r.json())',
            'std.http.delete': 'await fetch({0}, { method: "DELETE" }).then(r => r.json())',
            
            'std.json.parse': 'JSON.parse({0})',
            'std.json.stringify': 'JSON.stringify({0})',
            
            'std.crypto.hash_sha256': 'require("crypto").createHash("sha256").update({0}).digest("hex")',
            'std.crypto.hash_md5': 'require("crypto").createHash("md5").update({0}).digest("hex")',
            'std.crypto.random_bytes': 'require("crypto").randomBytes({0}).toString("hex")',
            
            'std.time.now': 'Date.now()',
            'std.time.sleep': 'await new Promise(r => setTimeout(r, {0}))',
            'std.time.format': 'new Date({0}).toLocaleString()',
            
            'std.gui.create_window': '(console.log("[gui] Window not supported in Node.js"), null)',
            'std.gui.open_webview': 'require("open")({0})',
            'std.gui.file_dialog': '(console.log("[gui] File dialog not supported in Node.js"), "")',
            'std.gui.folder_dialog': '(console.log("[gui] Folder dialog not supported in Node.js"), "")',
            'std.gui.message_box': 'console.log("[" + {0} + "] " + {1})',
            'std.gui.notification': 'console.log("🔔 " + {0} + ": " + {1})',
            'std.gui.canvas_create': 'document.createElement("canvas")',
            'std.gui.canvas_draw_rect': '{0}.getContext("2d").fillRect({1}, {2}, {3}, {4})',
            'std.gui.canvas_draw_text': '{0}.getContext("2d").fillText({1}, {2}, {3})',
            
            'std.3d.create_scene': 'new THREE.Scene()',
            'std.3d.add_cube': '(() => { const g = new THREE.BoxGeometry({3}, {3}, {3}); const m = new THREE.MeshStandardMaterial({color: {4}}); const c = new THREE.Mesh(g, m); c.position.set({0}, {1}, {2}); {5}.add(c); return c; })()',
            'std.3d.add_sphere': '(() => { const g = new THREE.SphereGeometry({3}); const m = new THREE.MeshStandardMaterial({color: {4}}); const s = new THREE.Mesh(g, m); s.position.set({0}, {1}, {2}); {5}.add(s); return s; })()',
            'std.3d.add_plane': '(() => { const g = new THREE.PlaneGeometry({0}, {1}); const m = new THREE.MeshStandardMaterial({color: {2}}); const p = new THREE.Mesh(g, m); return p; })()',
            'std.3d.add_light': '(() => { const l = new THREE.DirectionalLight({2}, {1}); {0}.add(l); return l; })()',
            'std.3d.set_camera': 'camera.position.set({1}, {2}, {3})',
            'std.3d.rotate': '{0}.rotation.set({1}, {2}, {3})',
            'std.3d.animate': 'requestAnimationFrame(() => { {1}(); renderer.render({0}, camera); })',
            'std.3d.render': 'renderer.render({0}, camera)',
            
            'std.system.get_platform': 'process.platform',
            'std.system.get_arch': 'process.arch',
            'std.system.get_home_dir': 'require("os").homedir()',
            'std.system.get_temp_dir': 'require("os").tmpdir()',
            'std.system.exec': 'require("child_process").execSync({0}, { encoding: "utf-8" })',
            'std.system.exec_async': 'require("child_process").spawn({0}, { shell: true })',
            'std.system.exit': 'process.exit({0})',
            'std.system.get_env': 'process.env[{0}] || ""',
            'std.system.set_env': 'process.env[{0}] = {1}',
            'std.system.notify': 'console.log("🔔 " + {0} + ": " + {1})',
            'std.system.clipboard_read': '""',
            'std.system.clipboard_write': 'console.log("[clipboard] " + {0})',
            'std.system.path_join': 'require("path").join(...{0})',
            'std.system.path_resolve': 'require("path").resolve({0})',
            'std.system.path_dirname': 'require("path").dirname({0})',
            'std.system.path_basename': 'require("path").basename({0})'
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_js_impl = register_js_impl;
}
