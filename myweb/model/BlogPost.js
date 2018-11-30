const {mongoose} = require('../database/database')
const {Schema} = mongoose
const BlogPostSchema = new Schema({
    title: {type: String, default: 'Haha', unique: true},
    content: {type: String, default: ''},
    date: {type: Date, default: Date.now},
    //1 blogpost - 1 user
    author:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
})
// User - n BlogPost
const BlogPost = mongoose.model('BlogPost', BlogPostSchema)
module.exports = { BlogPost }