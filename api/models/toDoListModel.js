// ToDoList.js
const mongoose = require('mongoose');

const toDoListSchema = new mongoose.Schema({
   
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const ToDoList = mongoose.model('ToDoList', toDoListSchema);

module.exports = ToDoList;
