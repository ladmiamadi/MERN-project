const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const {promisify} = require('util');
const pipeline = promisify(require('stream').pipeline);
const {uploadErrors} = require('../utils/errors.utils');

module.exports.readPost = (req, res) => {
    postModel.find()
    .then((posts)=> res.status(200).json(posts))
    .catch((error) => res.status(400).json({error}));
};

module.exports.createPost = async (req, res) => {
    let fileName;

    if(req.file != null) {
        try {
            if(req.file.detectedMimeType != "image/png" && 
            req.file.detectedMimeType != "image/jpg" &&
            req.file.detectedMimeType != "image/jpeg" ) throw Error("invalid file type");
    
            if(req.file.size > 500000) throw Error("File max size");
        } catch (err) {
            const error = uploadErrors(err);
            return res.status(400).json({error});
        }
            fileName = req.body.posterId + Date.now() + ".jpg";

            await pipeline(
                req.file.stream,
                fs.createWriteStream(
                    `${__dirname}/../../frontend/public/uploads/posts/${fileName}`
                )
            );
    }


    const {posterId, message, video} = req.body;
    const newPost = new postModel({
        posterId: posterId,
        message: message,
        picture: req.file != null ? './uploads/posts/' + fileName : "" ,
        video: video,
        likers: [],
        comments: [],
    });

        const post = newPost.save()
        .then((post)=> res.status(201).json({post}))
    .catch((error) => res.status(400).json({error}));
};

module.exports.updatePost = (req, res) => {
    !ObjectID(req.params.id)? res.status(400).send('Unkown ID: '+ req.params.id):

    postModel.findByIdAndUpdate(
        req.params.id,
        {$set: {message: req.body.message} },
        {new : true}
    )
    .then((post) => res.status(200).json({post}))
    .catch((error) => res.status(400).json({ error}));
};

module.exports.deletePost = (req, res) => {
    !ObjectID(req.params.id)? res.status(400).send('Unkown ID: '+ req.params.id):

    postModel.findByIdAndRemove(
        req.params.id,
    )
    .then((post) => res.status(204).json({post}))
    .catch((error) => res.status(400).json({ error}));
};

module.exports.likePost = async (req, res) => {
    if( !ObjectID(req.params.id)) res.status(400).send('Unkown ID: '+ req.params.id);
    
    try {
        await postModel.findByIdAndUpdate (
            req.params.id, 
            { $addToSet: { likers: req.body.id }},
            {new: true, upsert: true}
        );

        await userModel.findByIdAndUpdate (
            req.body.id ,
            { $addToSet: {likes: req.params.id}},
            {new: true, upsert: true},
        );
        return res.status(201).json({message: "Successfully added " + req.params.id});   
    } catch(error) {
        return res.status(400).json({error});
    }
        
};

module.exports.unlikePost = async (req, res) => {
    if(!ObjectID(req.params.id)) res.status(400).send('Unkown ID: '+ req.params.id);

    try {
        await postModel.findByIdAndUpdate (
            req.params.id, 
            { $pull: { likers: req.body.id }},
            {new: true, upsert: true}
        );

        await userModel.findByIdAndUpdate (
            req.body.id ,
            { $pull: {likes: req.params.id}},
            {new: true, upsert: true},
        );
        return res.status(201).json({message: "Successfully deleted " + req.params.id});   
    }
    
    catch {
        (error) => res.status(400).json({error});
    };
};

//comments

module.exports.commentPost = (req, res) => {
    !ObjectID(req.params.id)? res.status(400).send('Unkown ID: '+ req.params.id):

    postModel.findByIdAndUpdate(
        req.params.id,
        {$push: {
            comments: {
                commenterId: req.body.commenterId,
                commenterPseudo: req.body.commenterPseudo,
                text: req.body.text,
                timestamp: new Date().getTime()
            }
        }}
    )
    .sort({ createdAt: -1})
    .then(( post ) => res.status(200).json({ post }))
    .catch((error) => res.status(400).json({ error}));
};

module.exports.editCommentPost = (req, res) => {
    if(!ObjectID(req.params.id)) res.status(400).send('Unkown ID: '+ req.params.id);
    
    try {
        return postModel.findById(
            req.params.id,
            (err, docs) => {
                const theComment = docs.comments.find((comment) => comment._id.equals(req.body.commentId));

                if(!theComment) return res.status(400).send("Comment not found");
                theComment.text = req.body.text;

                return docs.save((error) => {
                    if(!error) return res.status(200).send(docs);
                    return res.status(400).send(error);
                })
            }
        );

    } catch (err) {
            return res.status(400).json({err});
    }
};

module.exports.deleteCommentPost = (req, res) => {
    !ObjectID(req.params.id)? res.status(400).send('Unkown ID: '+ req.params.id):

    postModel.findByIdAndUpdate(
        req.params.id,
        {$pull: {
            comments: {_id: req.body.commentId }
        }},
        {new: true}
    )
    .then(( post ) => res.status(200).json({ post }))
    .catch((error) => res.status(400).json({ error}));
};