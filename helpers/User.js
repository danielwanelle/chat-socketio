'use strict'

module.exports = function() {
    return  {
        SignUpValidation: (req, res, next) => {
            req.checkBody('username', 'Nome de usuário é obrigatório!').notEmpty();
            req.checkBody('username', 'Nome de usuário não pode ser menor que 5 caracteres!').isLength({min: 5});
            req.checkBody('email', 'Email é obrigatório!').notEmpty();
            req.checkBody('email', 'Email é inválido!').isEmail();
            req.checkBody('password', 'Senha é obrigatória!').notEmpty();
            req.checkBody('password', 'Senha não pode ser menor que 5 caracteres!').isLength({min: 5});
            req.getValidationResult()
                .then(result => {
                    const errors = result.array();
                    let messages = [];
                    errors.forEach(error => {
                        messages.push(error.msg);
                    });
                    req.flash('error', messages);
                    res.redirect('/signup');
                })
                .catch(err => {
                    return next();
                });
        }
    }
};