var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    mobile_number: {
        type: Number,
        required: false
    },
    age: {
        type: String,
        required: false
    }
    ,
    gender: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    }
    ,
    address: {
        type: String,
        required: false
    },
    pin: {
        type: Number,
        required: false
    },
    userType: {
        type: String,
        required: false
    }
    ,
    deviceId: {
        type: String,
        required: false
    }
});
var User = mongoose.model('user', userSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = User;