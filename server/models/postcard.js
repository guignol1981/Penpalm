let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostcardSchema = new Schema({
	author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	recipient: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	body: {type: String, required: true},
	backSideOptionType: {type: Number, required: true},
	backSideValue: {type: Schema.Types.Mixed, default: null},
	spotifyLink: {type: Schema.Types.Mixed, default: null},
	allowShare: {type: Boolean, default: false},
	template: {type: String, default: null},
	seen: {type: Boolean, default: false},
	creationDate: {type: Date, require: true}
});

let Postcard = mongoose.model('Postcard', PostcardSchema);
module.exports = Postcard;