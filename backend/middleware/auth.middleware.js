const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

//tester si l'utilisateur est connecté tout au lon de sa navigation
//comme c'est un middleware il faut ajouter un next
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt; // pour lire le cookie il faut un cookie parser

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', {
                    maxAge: 1
                });
                next();
            } else {
                let user = await userModel.findById(decodedToken.id);
                res.locals.user = user;
                console.log(user);
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err); // si ya pas de token on arrete tout pas de next()
                res.sendStatus(403).json("NO TOKEN");
            } else {
                console.log(decodedToken.id);
                res.status(200).json(decodedToken.id);
            }
        })
    } else {
        console.log("NO token");
    }
};