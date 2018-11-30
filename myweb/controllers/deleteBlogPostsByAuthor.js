const { BlogPost } = require('../model/BlogPost')

const deleteBlogPostsByAuthor = async (authorId) => {
    try {                                
        await BlogPost.deleteMany({
            author: authorId
        })
    } catch(error) {        
        throw error
    }
}

module.exports = { deleteBlogPostsByAuthor }