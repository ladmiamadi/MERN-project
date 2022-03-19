const express = require('express');
require('dotenv').config({
    path: './config/.env'
});
require('./config/db');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const cookieParser = require('cookie-parser');
const {
    checkUser,
    requireAuth
} = require('./middleware/auth.middleware');

const app = express();

const cors = require('cors');

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT, PATCH, POST, DELETE',
    'preflightContinue': false

};

app.use(cors(corsOptions));

app.use(express.json()); //remplace le body-parser qui est déprécié

app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

//vérifier si l'utilisateur a un token avant chaque requete pour assurer la sécurité
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.sendStatus(200).json(res.locals.user._id);
});

//routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

//server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});