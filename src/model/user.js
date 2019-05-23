const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema({
  name: String,
  age: Number,
  password: String,
  role: String,
  orders: [{ type: Schema.Types.ObjectId, ref: 'order' }],
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
