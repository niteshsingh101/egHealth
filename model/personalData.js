var mongoose = require('mongoose');
var userHealthSchema = mongoose.Schema({
    age: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    }
    ,
    height: {
        type: String,
        required: false
    },
    waist: {
        type: String,
        required: false
    }
    ,
    hip: {
        type: String,
        required: false
    },
    chest: {
        type: String,
        required: false
    },
    shoulder: {
        type: String,
        required: false
    },
    arms: {
        type: String,
        required: false
    },
    neck: {
        type: String,
        required: false
    },
    medicalIssue: {
        type: String,
        required: false
    },
    deviceId: {
        type: String,
        required: false
    },
}, { timestamps: { createdAt: 'created_at' } });
var personalBodyData = mongoose.model('personalData', userHealthSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = personalBodyData;