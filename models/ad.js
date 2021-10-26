const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
    


    location: String,
        date: Date,
        min_temp: Number,
        max_temp:Number,
        wind_speed:Number,
        wind_dir:String,
        wind_speed_night:Number,
        wind_dir_night:String,

    
    
})

module.exports.Ad = mongoose.model('Ad', adSchema)
