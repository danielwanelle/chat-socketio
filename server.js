const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const container = require('./container');
const passport = require('passport');

container.resolve(function(users, _) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    const app = SetupExpress();

    function SetupExpress(){
        require('./passport/passport-local');
        
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function() {
            console.log('Ouvindo a porta 3000');
        });

        ConfigureExpress(app);

        // Setup Router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        app.use(router);
    }

    function ConfigureExpress(app) {
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveInitialized: true,
            saveUninitialized: false,
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            })
        }));

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
});