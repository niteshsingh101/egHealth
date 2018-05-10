var mongoose = require('mongoose');
var specialtiesSchema = mongoose.Schema({
	title: {
        type: String,
        required: false
    }
});
var specialtiesData = mongoose.model('specialties', specialtiesSchema);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/healthApp');
module.exports = specialtiesData;
