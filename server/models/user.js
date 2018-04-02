let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String, required: true,
        trim: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    provider: {
        type: {
            id: String,
            token: String,
            source: String
        },
        select: false
    },
    penPal: {type: Schema.Types.ObjectId, ref: 'User', default: null}
});

UserSchema.statics.upsertFbUser = function (accessToken, refreshToken, profile, cb) {
    let that = this;

    return this.findOne({
        'provider.id': profile.id
    }, function (err, user) {
        if (!user) {
            let newUser = new that({
                email: profile.emails[0].value,
                provider: {
                    id: profile.id,
                    token: accessToken,
                    source: profile.provider
                }
            });
            newUser.matchPenPal((user) => {
                user.save(function (error, savedUser) {
                    if (error) {
                        console.log(error);
                    }
                    return cb(error, savedUser);
                });
            });
        } else {
            return cb(err, user);
        }
    });
};

UserSchema.methods.matchPenPal = function (callback) {
    this.model('User')
        .findOne()
        .where('penPal')
        .eq(null)
        .exec()
        .then(penPal => {
            if (penPal) {
                this.penPal = penPal;
                penPal.penPal = this;
                penPal.save().then(() => {
                    callback(this);
                });
            } else {
                callback(this);
            }
        });
};

let User = mongoose.model('User', UserSchema);
module.exports = User;