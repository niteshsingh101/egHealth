var mongoose = require('mongoose');
var facilitiesSchema = mongoose.Schema({
	name: {
        type: String,
        required: false
    }
});
var facilitiesData = mongoose.model('facilities', facilitiesSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = facilitiesData;
