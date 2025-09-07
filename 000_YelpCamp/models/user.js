const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

// 自動で username, hash, salt のフィールドが追加
// 抽象化されている
UserSchema.plugin(passportLocalMongoose); 
// ほかのファイルから呼び出せるように export
module.exports = mongoose.model('User', UserSchema);