const mongoose = require('mongoose');

const bcrypt =require('bcryptjs');

const userSchema = mongoose.Schema({
 

 email: String,
    password: String,
      confirmPassword:  String,

      eircode: String,
      
      token: String,
})


module.exports.users = mongoose.model('users', userSchema)
