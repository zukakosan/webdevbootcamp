const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.findAndValidate = async function(username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        // ユーザが存在し、パスワードが一致する場合はユーザ情報を返す
        // 一致しない場合は false を返す
        // ユーザオブジェクト　か　false という選択肢なのが少し注意
        return isValid ? user : false;
    }
    return false;
};

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        // パスワードが変更された時だけハッシュ化する
        // この条件がないと、パスワード以外のユーザ情報を更新してもパスワードの再ハッシュ化が走ってしまう
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
