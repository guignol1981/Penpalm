let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let jwt = require('jsonwebtoken');

let UserSchema = new Schema({
    email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    let that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function(err, user) {
        if (!user) {
            let newUser = new that({
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

let User = mongoose.model('User', UserSchema);
module.exports = User;