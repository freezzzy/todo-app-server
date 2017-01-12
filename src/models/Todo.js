import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title : { type: String, required: true },
  text: { type: String, required: true }
},
{
  timestamps: true
});

mongoose.model('Todo', TodoSchema);
