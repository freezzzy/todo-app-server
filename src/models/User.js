import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean }
},
{
  timestamps: true
});

mongoose.model('User', UserSchema);
