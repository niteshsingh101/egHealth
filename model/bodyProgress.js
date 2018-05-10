var mongoose = require('mongoose');
var bodyProgressSchema = mongoose.Schema({
    weightLoss: {
        type: Array,
        required: false
    },
    muscleGain: {
        type: Array,
        required: false
    },
    meditation: {
        type: Array,
        required: false
    }
    ,
    stamina: {
        type: Array,
        required: false
    },
    rehabilitation: {
        type: Array,
        required: false
    },
    timeFrame: {
        type: String,
        required: false
    },
    deviceId: {
        type: String,
        required: false
    },
}, { timestamps: { createdAt: 'created_at' } });
var bodyProgressData = mongoose.model('bodyProgress', bodyProgressSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = bodyProgressData;