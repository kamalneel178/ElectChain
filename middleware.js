var unless = require('express-unless');

module.exports.makeAuthHappen = function (options) {
    var middleware = function (req, res, next) {

        if (!req.cookies || !req.cookies.token) {

            var payload = {
                userType: 'guest',
                firstName: 'Guest'
            };

            var token = req.app.jwt.sign(payload, req.app.jwtSecret);

            res.cookie('token', token);

            req.JWTData = payload;

            next();
            return;
        }

        var decoded = req.app.jwt.decode(req.cookies.token);
        req.JWTData = decoded;

        next();
    };

    middleware.unless = unless;

    return middleware;

};