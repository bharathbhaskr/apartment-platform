const mongoose = require('mongoose');

//Defining Schema
const userSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        minlength: 3 
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required: true,
        minlength: 6
    },

    //Other Fields
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        default : null
    }



})

//Create the User Model
const User = mongoose.model('User', userSchema);

//Exporting
module.exports = User;