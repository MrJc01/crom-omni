class User {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
    }
}

// @entity Repository: User
User.find = async (id, options = {}) => {
    const db = await Database.get('main_db');
    const row = await db.get('SELECT * FROM User WHERE id = ?', [id]);
    if (!row) return null;
    const obj = new User(row);
    return obj;
};

User.save = async (obj) => {
    const db = await Database.get('main_db');
    if (obj.id) {
        await db.run('UPDATE User SET name=?, email=? WHERE id=?', [obj.name, obj.email, obj.id]);
    } else {
        const r = await db.run('INSERT INTO User (name, email) VALUES (?, ?)', [obj.name, obj.email]);
        obj.id = r.lastID;
    }
    return obj;
};

User.all = async () => {
    const db = await Database.get('main_db');
    return (await db.all('SELECT * FROM User')).map(r => new User(r));
};

User.where = async (conditions) => {
    const db = await Database.get('main_db');
    const keys = Object.keys(conditions);
    const where = keys.map(k => k + ' = ?').join(' AND ');
    const values = Object.values(conditions);
    return (await db.all('SELECT * FROM User WHERE ' + where, values)).map(r => new User(r));
};

User.delete = async (id) => {
    const db = await Database.get('main_db');
    await db.run('DELETE FROM User WHERE id = ?', [id]);
};

class Post {
    constructor(data = {}) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.title = data.title;
        this.content = data.content;
    }
}

// @entity Repository: Post
Post._relations = {
    user_id: { entity: 'User', column: 'user_id' },
};

Post.find = async (id, options = {}) => {
    const db = await Database.get('main_db');
    const row = await db.get('SELECT * FROM Post WHERE id = ?', [id]);
    if (!row) return null;
    const obj = new Post(row);
    // Lazy load user
    Object.defineProperty(obj, 'user', {
        get: async function() {
            if (!this._user) this._user = await User.find(this.user_id);
            return this._user;
        }
    });
    return obj;
};

Post.findWith = async (id, includes = []) => {
    const obj = await Post.find(id);
    if (!obj) return null;
    for (const rel of includes) {
        if (rel === 'user') obj._user = await User.find(obj.user_id);
    }
    return obj;
};

Post.save = async (obj) => {
    const db = await Database.get('main_db');
    if (obj.id) {
        await db.run('UPDATE Post SET user_id=?, title=?, content=? WHERE id=?', [obj.user_id, obj.title, obj.content, obj.id]);
    } else {
        const r = await db.run('INSERT INTO Post (user_id, title, content) VALUES (?, ?, ?)', [obj.user_id, obj.title, obj.content]);
        obj.id = r.lastID;
    }
    return obj;
};

Post.all = async () => {
    const db = await Database.get('main_db');
    return (await db.all('SELECT * FROM Post')).map(r => new Post(r));
};

Post.where = async (conditions) => {
    const db = await Database.get('main_db');
    const keys = Object.keys(conditions);
    const where = keys.map(k => k + ' = ?').join(' AND ');
    const values = Object.values(conditions);
    return (await db.all('SELECT * FROM Post WHERE ' + where, values)).map(r => new Post(r));
};

Post.delete = async (id) => {
    const db = await Database.get('main_db');
    await db.run('DELETE FROM Post WHERE id = ?', [id]);
};

class Comment {
    constructor(data = {}) {
        this.id = data.id;
        this.post_id = data.post_id;
        this.user_id = data.user_id;
        this.text = data.text;
    }
}

// @entity Repository: Comment
Comment._relations = {
    post_id: { entity: 'Post', column: 'post_id' },
    user_id: { entity: 'User', column: 'user_id' },
};

Comment.find = async (id, options = {}) => {
    const db = await Database.get('main_db');
    const row = await db.get('SELECT * FROM Comment WHERE id = ?', [id]);
    if (!row) return null;
    const obj = new Comment(row);
    // Lazy load post
    Object.defineProperty(obj, 'post', {
        get: async function() {
            if (!this._post) this._post = await Post.find(this.post_id);
            return this._post;
        }
    });
    // Lazy load user
    Object.defineProperty(obj, 'user', {
        get: async function() {
            if (!this._user) this._user = await User.find(this.user_id);
            return this._user;
        }
    });
    return obj;
};

Comment.findWith = async (id, includes = []) => {
    const obj = await Comment.find(id);
    if (!obj) return null;
    for (const rel of includes) {
        if (rel === 'post') obj._post = await Post.find(obj.post_id);
        if (rel === 'user') obj._user = await User.find(obj.user_id);
    }
    return obj;
};

Comment.save = async (obj) => {
    const db = await Database.get('main_db');
    if (obj.id) {
        await db.run('UPDATE Comment SET post_id=?, user_id=?, text=? WHERE id=?', [obj.post_id, obj.user_id, obj.text, obj.id]);
    } else {
        const r = await db.run('INSERT INTO Comment (post_id, user_id, text) VALUES (?, ?, ?)', [obj.post_id, obj.user_id, obj.text]);
        obj.id = r.lastID;
    }
    return obj;
};

Comment.all = async () => {
    const db = await Database.get('main_db');
    return (await db.all('SELECT * FROM Comment')).map(r => new Comment(r));
};

Comment.where = async (conditions) => {
    const db = await Database.get('main_db');
    const keys = Object.keys(conditions);
    const where = keys.map(k => k + ' = ?').join(' AND ');
    const values = Object.values(conditions);
    return (await db.all('SELECT * FROM Comment WHERE ' + where, values)).map(r => new Comment(r));
};

Comment.delete = async (id) => {
    const db = await Database.get('main_db');
    await db.run('DELETE FROM Comment WHERE id = ?', [id]);
};

