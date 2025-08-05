
// モジュールの読み込み方独特やな、、require で読み込むのか。。。
const fs = require('fs');
const dirName =process.argv[2] || 'Project';
// fs.mkdir('newDir', { recursive: true }, (err) => {
//     console.log('newDir created');
//     if (err) {
//         console.error('Directory creation failed:', err);
//     }});

// ディレクトリ作成後に次の処理を行いたいので、mkdirSync を使用
if (!fs.existsSync(dirName)) {
    console.log(`${dirName} does not exist, creating...`);
    fs.mkdirSync(dirName);
} else {
    console.log(`${dirName} already exists.`);
}
fs.writeFileSync(`${dirName}/index.html`, '<h1>Hello World</h1>');
fs.writeFileSync(`${dirName}/style.css`, 'body { background-color: lightblue; }');
fs.writeFileSync(`${dirName}/app.js`, 'console.log("Hello from app.js");');