const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    members: 
    {
      type: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      }],
      default: [],
    },
    //ToDoList or Shopping list
    tasks: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ToDoList',
        }],
        default: [],
      },

    chores:
    {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chore',
      }],
      default: [],
    }  ,

    // calendar: {
    //     //Define structure for calendar
    // },

});

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;