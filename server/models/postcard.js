let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostcardSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    recipient: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    body: {type: String, required: true},
    imageUrl: {type: String},
    imageFitType: {type: String, default: 'contain'},
    seen: {type: Boolean, default: false},
    creationDate: {type: Date, require: true}
});

let Postcard = mongoose.model('Postcard', PostcardSchema);
module.exports = Postcard;