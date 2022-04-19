const { isValidObjectId } = require('mongoose');
const userModel = require('../models/user.model');

module.exports.getAllUsers = (req, res) => {
    userModel.find()
            .select('-password')
            .then((users)=> res.status(200).json(users))
            .catch((error) => res.status(400).json({error}));
};

module.exports.userInfo = (req, res) => {
    !isValidObjectId(req.params.id)? res.status(200).send('Unkown ID: '+ req.params.id):
    userModel.findOne({
        id: req.params.id
    })
            .select('-password')        
            .then((user) => res.status(200).json(user))
            .catch((error) => res.status(400).json({error}));4
};

module.exports.updateUser = (req, res) => {
    !isValidObjectId(req.params.id)? res.status(200).send('Unkown ID: '+ req.params.id):

    userModel.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {
            bio: req.body.bio
        }},
        {new: true, upsert: true, setDefaultsOnInsert: true}
    )
            .then((user) => res.status(200).json({user}))
            .catch((error) => res.status(500).json({error}));
};

module.exports.deleteUser = (req, res, next) => {
    !isValidObjectId(req.params.id)? res.status(400).send('Unkown ID: '+ req.params.id):

    userModel.deleteOne({
        _id: req.params.id
    })
            .then(() => res.status(200).json({message: "Successfully deleted!"}))
            .catch((error) => res.status(500).json({error}));
};

module.exports.follow = async (req, res) => {
    if(!isValidObjectId(req.params.id) || !isValidObjectId(req.body.idToFollow)) return res.status(200).send('Unkown ID: '+ req.params.id);

    try {
        await userModel.findByIdAndUpdate (
            req.params.id, 
            { $addToSet: { following: req.body.idToFollow }},
            {new: true, upsert: true}
        );

        await userModel.findByIdAndUpdate (
            req.body.idToFollow ,
            { $addToSet: {followers: req.params.id}},
            {new: true, upsert: true},
        );
        return res.status(201).json({message: "Successfully added " + req.params.id});   
    }
    
    catch {
        (error) => res.status(400).json({error});
    }
};

module.exports.unfollow = async (req, res) => {
    if(!isValidObjectId(req.params.id) || !isValidObjectId(req.body.idToUnfollow)) return res.status(200).send('Unkown ID: '+ req.params.id);

    try {
        await userModel.findByIdAndUpdate (
            req.params.id, 
            { $pull: { following: req.body.idToUnfollow }},
            {new: true, upsert: true}
        );

        await userModel.findByIdAndUpdate (
            req.body.idToUnfollow ,
            { $pull: {followers: req.params.id}},
            {new: true, upsert: true},
        );
        return res.status(201).json({message: "Successfully deleted " + req.params.id});   
    }
    
    catch {
        (error) => res.status(400).json({error});
    }
};

