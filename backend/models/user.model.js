const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55,
        unique: true,
        trim: true   //pour supprimer les espaces
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail], // bibliotheque validator
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        minlength: 6
    },
    bio: {
        type: String,
        max: 1024
    },
    picture: {
        type: String,
        default: "./uploads/profil/random-user.png"
    },
    followers: {
        type: [String],

    },
    following: {
        type: [String]
    },
    likes: {
        type: [String]
    }
},
{
    timestamps: true // pour savoir la date d'enregistrement
});

userSchema.plugin(uniqueValidator);

//execute function  before saving user in dataBase
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function ( email, password ) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }

        throw Error(' incorrect password');
    }
    throw Error(' incorrect email');
}

module.exports = mongoose.model('User', userSchema); //user est le nom de la table dans mongoDB