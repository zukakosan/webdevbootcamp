const bcrypt = require('bcrypt');

// const hashPW = async(pw) => {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(pw, salt);
//     console.log("Salt: "+salt);
//     console.log("Hash: "+hash);
// };

const hashPW = async(pw) => {
    const hash = await bcrypt.hash(pw, 10);
    console.log("Hash: "+hash);
};

// const pw = input("Enter password to hash: ");
hashPW("abcdef");

const comparePW = async(pw, hash) => {
    const match = await bcrypt.compare(pw, hash);
    console.log("Password match: "+match);
};

// bcrypt.compare()は、比較対象から salt を自動で取り出してくれる
// bcrypt のハッシュ文字列は version/cost（ラウンド）と salt を含んでいる（例: $2b$10$<22文字のsalt><31文字のhash>）。
// 第二引数は、salt 混みのハッシュ文字列を与える必要がある
// その salt を使って、bcrypt.compare()が自動で第一引数をハッシュ化して比較してくれる
comparePW("abcdef","$2b$10$7eLFwoq/03EzwekSaV2yBOLRyR6pujwlrOUP0clG5S1ezYM2DKB72")
