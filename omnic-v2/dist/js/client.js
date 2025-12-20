const models = require("./shared/models.js");
if (typeof global !== 'undefined') Object.assign(global, models);
function display_user(user) {
    print("User: " + user.name + " (" + user.email + ")");
}
function main() {
    print("Client starting...");
    let user = create_user(42, "Alice", "alice@example.com");
    display_user(user);
}
