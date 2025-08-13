// DB に接続
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Database connection error:', err);
});

const personSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, min: 0 },
  email: { type: String, required: true, unique: true }
});

personSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Person = mongoose.model('Person', personSchema);
const person = new Person({
  firstName: 'Taro',
  lastName: 'Yamada',
  age: 30,
  email: 'taro@example.com'
});

console.log(person.fullName);
