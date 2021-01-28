'use strict';

module.exports = function(_, passport, User, validator) {
    return {
        SetRouting: function(router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);
            // router.post('/', User.LoginValidation, this.postLogin);
            // router.post('/signup', User.SignUpValidation, this.postSignUp);
            router.post('/signup', [
                validator.check('username').not().isEmpty().isLength({min: 5}).withMessage('Usuário inválido'),
                validator.check('email').not().isEmpty().isEmail().withMessage('Email inválido'),
                validator.check('password').not().isEmpty().withMessage('Senha inválida'),
            ], this.postValidation, this.postSignUp);
            router.post('/', [
                validator.check('email').not().isEmpty().isEmail().withMessage('Email inválido'),
                validator.check('password').not().isEmpty().withMessage('Senha inválida'),
            ], this.postValidation, this.postLogin);
        },
        indexPage: function(req, res) {
            const errors = req.flash('error');
            return res.render('index', {
                title: 'Footballkik | Login',
                messages: errors,
                hasErrors: errors.length > 0
            });
        },
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        getSignUp: function(req, res) {
            const errors = req.flash('error');
            return res.render('signup', {
                title: 'Footballkik | SignUp',
                messages: errors,
                hasErrors: errors.length > 0
            });
        },
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        homePage: function(req, res) {
            return res.render('home');
        },
        postValidation: function(req, res, next) {
            const err = validator.validationResult(req);
            const errors = err.array();
            let messages = [];
            errors.forEach(error => {
                messages.push(error.msg);
            });
            if (messages.length > 0) {
                req.flash('error', messages);
                if (req.url === '/signup') {
                    res.redirect('/signup');
                } else if (req.url === '/') {
                    res.redirect('/');
                }
            }
            return next();
        }
    }
}