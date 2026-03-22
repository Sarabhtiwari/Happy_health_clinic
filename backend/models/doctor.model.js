const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
   description: {
    type: String,
    required:true
   },
   qualification: {
    type: String,
    required: true
   },{timestamps: true})

const User = mongoose.model('User',userSchema);
module.exports = User