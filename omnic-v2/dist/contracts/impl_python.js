const types = require("./types.js");
if (typeof global !== 'undefined') Object.assign(global, types);
function register_python_impl(registry) {
    
        registry.implementations['python'] = {
            'std.io.print': 'print({0})',
            'std.io.println': 'print({0})',
            'std.io.input': 'input({0})',
            'std.io.error': 'print({0}, file=sys.stderr)',
            
            'std.fs.read_file': 'open({0}).read()',
            'std.fs.write_file': 'open({0}, "w").write({1})',
            'std.fs.exists': 'os.path.exists({0})',
            'std.fs.delete': 'os.remove({0})',
            'std.fs.list_dir': 'os.listdir({0})',
            'std.fs.mkdir': 'os.makedirs({0}, exist_ok=True)',
            
            'std.http.get': 'requests.get({0}).json()',
            'std.http.post': 'requests.post({0}, json={1}).json()',
            'std.http.put': 'requests.put({0}, json={1}).json()',
            'std.http.delete': 'requests.delete({0}).json()',
            
            'std.json.parse': 'json.loads({0})',
            'std.json.stringify': 'json.dumps({0})',
            
            'std.crypto.hash_sha256': 'hashlib.sha256({0}.encode()).hexdigest()',
            'std.crypto.hash_md5': 'hashlib.md5({0}.encode()).hexdigest()',
            'std.crypto.random_bytes': 'secrets.token_hex({0})',
            
            'std.time.now': 'int(time.time() * 1000)',
            'std.time.sleep': 'time.sleep({0} / 1000)',
            'std.time.format': 'datetime.fromtimestamp({0} / 1000).strftime({1})',
            
            'std.gui.create_window': 'webview.create_window({0}, width={1}, height={2})',
            'std.gui.open_webview': 'webbrowser.open({0})',
            'std.gui.file_dialog': 'tkinter.filedialog.askopenfilename(title={0}, filetypes={1})',
            'std.gui.folder_dialog': 'tkinter.filedialog.askdirectory(title={0})',
            'std.gui.message_box': 'tkinter.messagebox.showinfo({0}, {1})',
            'std.gui.notification': 'plyer.notification.notify(title={0}, message={1})'
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_python_impl = register_python_impl;
}
