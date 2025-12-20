class User:
    def __init__(self, id=None, name=None, email=None):
        self.id = id
        self.name = name
        self.email = email
class Message:
    def __init__(self, id=None, user_id=None, content=None):
        self.id = id
        self.user_id = user_id
        self.content = content
def create_user(id, name, email):
    return User(id=id, name=name, email=email)


__all__ = ['User', 'Message', 'create_user']
