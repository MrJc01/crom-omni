VERSION = "1.0.0"
def greet(name):
    return "Hello, "
    # Unknown stmt: 0
    name

class Person:
    def __init__(self, data=None):
        if data is None: data = {}
        self.name = data.get('name')
        self.age = data.get('age')


def internal_helper():
    return 42


__all__ = ['VERSION', 'greet', 'Person']
