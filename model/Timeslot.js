var mongoose = require('mongoose');
var timeSlotSchema = mongoose.Schema({
	name: {
        type: String,
        required: false
    }
});
var timeSlotData = mongoose.model('timeSlot', timeSlotSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = timeSlotData;
