import mongoose from 'mongoose';

import config from '../../etc/config.json';

import '../models/Todo';
import '../models/User';

const Todo = mongoose.model('Todo');
const User = mongoose.model('User');

export function setUpConnection() {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${config.db.login}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`);
}

export function createTodo(data) {
  const todo = new Todo({
    title : data.title,
    text: data.text
  });

  return todo.save();
}

export function getTodosList() {
  return Todo.find();
}

export function getTodoById(id) {
  return Todo.findById(id);
}

export function deleteTodo(id) {
  return Todo.findById(id).remove();
}

export function createUser(data) {
  const user = new User({
    login : data.login,
    password: data.password,
    admin: data.admin
  });

  return user.save();
}

export function getUsersList() {
  return User.find();
}

export function getUserById(id) {
  return User.findById(id);
}

export function getUserByLogin(login) {
  return User.findOne({
    login: login
  });
}
