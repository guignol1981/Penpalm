let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PreferenceSchema = new Schema({
	displayImage: {type: Boolean, default: true},
	displayName: {type: Boolean, default: true},
	emailNotifications: {type: Boolean, default: true}
});

let Preference = mongoose.model('Preference', PreferenceSchema);
module.exports = Preference;