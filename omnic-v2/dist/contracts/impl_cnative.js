const types = require("./types.js");
if (typeof global !== 'undefined') Object.assign(global, types);
function register_cnative_impl(registry) {
    
        registry.implementations['c_native'] = {
            'std.io.print': 'printf("%s", {0})',
            'std.io.println': 'printf("%s\\n", {0})',
            'std.io.input': 'fgets(buffer, sizeof(buffer), stdin)',
            'std.io.error': 'fprintf(stderr, "%s\\n", {0})',
            
            'std.fs.read_file': 'omni_read_file({0})',
            'std.fs.write_file': 'omni_write_file({0}, {1})',
            'std.fs.exists': 'access({0}, F_OK) == 0',
            'std.fs.delete': 'remove({0})',
            'std.fs.list_dir': 'omni_list_dir({0})',
            'std.fs.mkdir': 'mkdir({0}, 0755)',
            
            'std.http.get': 'curl_get({0})',
            'std.http.post': 'curl_post({0}, {1})',
            'std.http.put': 'curl_put({0}, {1})',
            'std.http.delete': 'curl_delete({0})',
            
            'std.json.parse': 'cJSON_Parse({0})',
            'std.json.stringify': 'cJSON_Print({0})',
            
            'std.crypto.hash_sha256': 'openssl_sha256({0})',
            'std.crypto.hash_md5': 'openssl_md5({0})',
            'std.crypto.random_bytes': 'omni_random_bytes({0})',
            
            'std.time.now': '(long long)(time(NULL) * 1000)',
            'std.time.sleep': 'usleep({0} * 1000)',
            'std.time.format': 'strftime(buffer, sizeof(buffer), {1}, localtime(&{0}))',
            
            'std.gui.create_window': 'webview_create({1}, {2}, {0})',
            'std.gui.open_webview': 'webview_navigate(wv, {0})',
            'std.gui.file_dialog': 'nfd_open_dialog({0}, {1})',
            'std.gui.folder_dialog': 'nfd_pick_folder({0})',
            'std.gui.message_box': 'MessageBox(NULL, {1}, {0}, MB_OK)',
            'std.gui.notification': 'omni_notify({0}, {1})'
        };
    
}


// Auto-exports
if (typeof exports !== 'undefined') {
    exports.register_cnative_impl = register_cnative_impl;
}
