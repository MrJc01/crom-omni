import models
def handle_request(user_id):
    user = create_user(user_id, "John", "john@example.com")
    return user

def main():
    print("Server starting...")
    user = handle_request(1)
    print("Created user: " + user.name)

