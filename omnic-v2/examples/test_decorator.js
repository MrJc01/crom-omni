function MyFunc() {
    print('Inside MyFunc');
}
MyFunc.decorators = [{ name: "ui", args: [{ value: 'MyComponent' }] }];
class Data {
    constructor(data = {}) {
        this.x = data.x;
    }
}
Data.decorators = [{ name: "ui", args: [{ value: 'MyStruct' }, { name: "width", value: 100 }] }];
function main() {
    print('Checking decorators...');
    
}
