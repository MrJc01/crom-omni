class User {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
    }
}
class Message {
    constructor(data = {}) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.content = data.content;
    }
}
function create_user(id, name, email) {
    return new User({ id: id, name: name, email: email });
}

module.exports = { User, Message, create_user };
