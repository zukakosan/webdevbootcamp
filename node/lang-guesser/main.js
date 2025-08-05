const franc = require('franc');
// import {franc, francAll} from 'franc';
const langs = require('langs');
// const colors = require('colors');

const text = process.argv[2];
console.log(process.argv[2]);
const langCode = franc(text);
console.log(langCode);
if (langCode === 'und') {
    console.log("Sorry, I can't guess the language.");
} else {

    const lang = langs.where("3", langCode);
    // console.log(guess_name.name);
    console.log(`This text is likely written in ${lang.name}`);
}
// console.log(guess);

