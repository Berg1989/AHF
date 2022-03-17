const PostModel = require('../models/post');

exports.createPost = (headline, body, author) => {
    return result = PostModel.create({
        postdate: new Date().toDateString(),
        body: body,
        headline: headline.charAt(0).toUpperCase() + headline.slice(1),
        author: author
    })
};

exports.findPosts = () => {
    return PostModel.find().exec();
}

exports.deletePost = id => {
    return PostModel.findByIdAndDelete(id).exec();
}

exports.findPost = id => {
    return PostModel.findById(id).exec();
}

exports.updatePost = (id, headline, body) => {

    return PostModel.findByIdAndUpdate(id, {
        $set: {
            headline: headline,
            body: body,
        }
    }).exec();
};

exports.findPosts = () => {
    return PostModel.find().exec();
};