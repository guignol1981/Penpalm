let express = require('express');
let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
let port = process.env.PORT || '3000';
let api = require('./server/routes/api');
let passport = require('passport');
require('./server/services/scheduled-job');

app.set('view engine', 'pug');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'server/configs/google-api.json');

setInterval(function () {
	http.get("http://penpalm.herokuapp.com");
}, 300000);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

require('./server/passport/facebook-strategy');
require('./server/passport/google-strategy');
require('./server/passport/local-strategy');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}

mongoose.Promise = global.Promise;

if (process.env.DB) {
    mongoose.connect(process.env.DB);
} else {
    mongoose.connect('mongodb://localhost/penpalm');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());

app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(function (err, req, res) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message": err.name + ": " + err.message});
    }
});

app.set('port', port);
let server = http.createServer(app);

server.listen(port, () => console.log(`PenPalm api running on localhost:${port}`));
