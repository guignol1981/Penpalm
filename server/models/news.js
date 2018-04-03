let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NewsSchema = new Schema({
	title: {type: String, required: true},
	body: {type: String, required: true},
	imageUrl: {type: String}
});

let News = mongoose.model('News', NewsSchema);
module.exports = News;