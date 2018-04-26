let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let crypto = require('crypto');

let UserSchema = new Schema({
    name: {type: String, require: true},
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    photoData: {type: Schema.Types.Mixed, default: {cloudStorageObject: null, cloudStoragePublicUrl: null}},
    provider: {
        type: {
            id: String,
            token: String,
            source: String
        },
        select: false
    },
    language: {type: String, default: null},
    country: {type: String, default: null},
    description: {type: String, default: ''},
    enableEmailNotifications: {type: Boolean, default: true},
    pendingRequests: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    pals: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    hash: {type: String},
    salt: {type: String},
    emailVerified: {type: Boolean, default: false}
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.statics.upsertSocialUser = function (accessToken, refreshToken, profile, callback) {
    let that = this;

    return this.findOne({
        'provider.id': profile.id
    }, function (err, user) {
        if (!user) {
            let newUser = new that({
                name: profile.name.givenName,
                email: profile.emails[0].value,
                photoData: {
                    cloudStorageObject: null,
                    cloudStoragePublicUrl: profile.photos ? profile.photos[0].value : profile._json.picture
                },
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

UserSchema.methods.unmatch = function (userId, callback) {
    let index = this.pals.indexOf(userId);

    if (index > -1) {
        this.pals.splice(index, 1);
        this.save().then(() => {
            callback(this);
        });
    } else {
        callback(this);
    }
};

UserSchema.methods.removePendingRequest = function (userId, callback) {
    let index = this.pendingRequests.indexOf(userId);

    if (index > -1) {
        this.pendingRequests.splice(index, 1);
        this.save().then(() => {
            callback(this);
        });
    } else {
        callback(this);
    }
};


let User = mongoose.model('User', UserSchema);

module.exports = User;