let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostcardSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    recipient: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    body: {type: String, required: true},
    imageUrl: {type: String},
    uploadedImage: {type: String},
    imageFitType: {type: String, default: 'contain'},
    spotifyLink: {type: String, default: null},
    youtubeId: {type: String, default: null},
    allowShare: {type: Boolean, default: false},
    template: {type: String, default: 'none'},
    location: {type: Object, default: null},
    seen: {type: Boolean, default: false},
    creationDate: {type: Date, require: true}
});

let Postcard = mongoose.model('Postcard', PostcardSchema);
module.exports = Postcard;