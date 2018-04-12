let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {type: String, require: true},
    email: {
        type: String, required: true,
        trim: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    photoUrl: {type: String},
    provider: {
        type: {
            id: String,
            token: String,
            source: String
        },
        select: false
    },
    language: {type: String, default: 'English'},
    country: {type: String, default: ''},
    description: {type: String, default: ''},
    showPicture: {type: Boolean, default: true},
    showName: {type: Boolean, default: true},
    enableEmailNotifications: {type: Boolean, default: true}
});

UserSchema.statics.upsertSocialUser = function (accessToken, refreshToken, profile, callback) {
    let that = this;

    return this.findOne({
        'provider.id': profile.id
    }, function (err, user) {
        if (!user) {
            let newUser = new that({
                name: profile.name.givenName,
                email: profile.emails[0].value,
                photoUrl: profile.photos ? profile.photos[0].value : profile._json.picture,
                provider: {
                    id: profile.id,
                    token: accessToken,
                    source: profile.provider
                },
            });

            newUser.save(function (error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return callback(error, savedUser);
            });
        } else {
            return callback(err, user);
        }
    });
};

let User = mongoose.model('User', UserSchema);

module.exports = User;