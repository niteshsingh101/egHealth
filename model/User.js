var mongoose = require('mongoose');
//var restful = require('node-restful');
//var mongoose = restful.mongoose;
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    mobile_number: {
        type: Number,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    }
});
var User = mongoose.model('user', userSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = User;