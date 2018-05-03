
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uuid = require('uuid');
let EmailVerificationLinkSchema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   link: {type: String, required: true}
});

EmailVerificationLinkSchema.methods.generateLink = function() {
    this.link = uuid();
};

let EmailVerificationLink = mongoose.model('EmailVerificationLink', EmailVerificationLinkSchema);

module.exports = EmailVerificationLink;