var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    mobile_number: {
        type: String,
        required: false
    },
    age: {
        type: Number,
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
    },
    status: {
        type: Number,
        required: false
    },
    otp: {
        type: Number,
        required: false
    },
    experience_year: {
            type: String,
            required: false
        },
    location: {
            type: String,
            required: false
        },
    info: {
            type: String,
            required: false
        },
    fullBio: {
            type: String,
            required: false
        },
    youtube: {
            type: String,
            required: false
        },
    facebook: {
            type: String,
            required: false
        },
    twitter: {
            type: String,
            required: false
        },
    website: {
            type: String,
            required: false
        },
    profilePic: {
            type: String,
            required: false
        },
    certificate: {
            type: String,
            required: false
        },
    specialties: {
        type: Array,
        required: false
    },
    facilities: {
        type: Array,
        required: false
    }       
});
var User = mongoose.model('user', userSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = User;
