module.exports.signUpErrors= (error) => {
    let errors = {pseudo: '', email: '', password: ''};

    if(error.message.includes('pseudo')) {
        errors.pseudo = "Pseudo incorrect ou déja pris!";
    }

    if(error.message.includes('email')) {
        errors.email = "email incorrect ou existe déja!";
    }

    if(error.message.includes('password')) {
        errors.password = "Le mot de passe doit contenir au moins 6 caractères!";
    }

    return errors;
}

module.exports.signInErrors= (error) => {
    let errors = { email: '', password: ''};

    if(error.message.includes('email')) errors.email = "email incorrect!";

    if(error.message.includes('password')) errors.password = "Le mot de passe est incorrect!!";

    return errors;
}

module.exports.uploadErrors = (error) => {
    let errors = { format: '', maxSize: ''};

    if(error.message.includes('invalid file')) errors.format = "Format incompatible!";

    if(error.message.includes('max size')) errors.maxSize = "le fichier dépasse 500ko!!";

    return errors;
};