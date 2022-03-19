const userModel = require('../models/user.model');
const fs = require('fs');
const {promisify} = require('util');
const pipeline = promisify(require('stream').pipeline);
const {uploadErrors} = require('../utils/errors.utils');

module.exports.uploadProfil = async (req, res) => {
    try {
        if(req.file.detectedMimeType != "image/png" && 
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/jpeg" ) throw Error("invalid file type");

        if(req.file.size > 500000) throw Error("File max size");
    } catch (err) {
        const error = uploadErrors(err);
        return res.status(400).json({error});
    }
        const fileName = req.body.name + ".jpg";

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../../frontend/public/uploads/profil/${fileName}`
            )
        );

        userModel.findByIdAndUpdate(
            req.body.userId,
            {$set: {picture: "./uploads/profil" + fileName}}, 
            {new: true, upsert: true, setDefaultsOnInsert: true}
        )
        .then(res.status(200).json("picture successefully added"))
        .catch((error) => res.status(400).json({ error}));

    
};