const Post = require('../models/post');

exports.createPost = (headline, body, author) => {
    return result = Post.create({
        postdate: new Date().toDateString(),
        body: body,
        headline: headline.charAt(0).toUpperCase() + headline.slice(1),
        author: author
    })
};

exports.findPosts = () => {
    return Post.find().exec();
}

exports.deletePost = id => {
    return Post.findByIdAndDelete(id).exec();
}

exports.findPost = id => {
    return Post.findById(id).exec();
}

exports.updatePost = (id, headline, body) => {

    return Post.findByIdAndUpdate(id, {
        $set: {
            headline: headline,
            body: body,
        }
    }).exec();
};

exports.findPosts = () => {
    return Post.find().exec();
};