let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DeletedAccountMailSchema = new Schema({
	email: {type: String, required: true},
	creationDate: {type: Date, required: true}
});

let DeletedAccountMail = mongoose.model('DeletedAccountMail', DeletedAccountMailSchema);
module.exports = DeletedAccountMail;