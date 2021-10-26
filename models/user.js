const mongoose = require('mongoose');

const bcrypt =require('bcryptjs');

const userSchema = mongoose.Schema({
    //username: String,
  //  password: String,

 email: {
        type: String,
        required: true,
      },

    password: {
        type: String,
        required: true,
      },
      confirmPassword: {
        type: String,
        required: true,
      },
      token: String,
      eircode: {
        type: String,
        required: true,
        unique: true,
      },

});


module.exports.users = mongoose.model('users', userSchema)