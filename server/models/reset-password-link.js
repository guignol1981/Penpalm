let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uuid = require('uuid');

let ResetPasswordLinkSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    link: {type: String, required: true}
});

ResetPasswordLinkSchema.methods.generateLink = function() {
    this.link = uuid();
};

let ResetPasswordLink = mongoose.model('ResetPasswordLink', ResetPasswordLinkSchema);

module.exports = ResetPasswordLink;