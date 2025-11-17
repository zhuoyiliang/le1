let buffer = Buffer.alloc(10);
let buufer = Buffer.allocUnsafe(10); // 可能有未初始化的内存
let buffer2 = Buffer.from([1, 2, 3, 4, 5]);


let buffer3 = Buffer.from("helloxxx");
console.log(buffer3);
console.log(buffer3[0].toString(16));

const fs = require("fs");
const path = require("path");
const inputPath = path.resolve(__dirname,'..', "test.txt");
fs.writeFileSync(inputPath, "hello world");