const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema({
    choreName: {
        type: String,
        unique: true,
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      completed: {
        type: Boolean,
        default: false,
      }, 
    });


const Chore = mongoose.model('Chore', choreSchema);

module.exports = Chore;