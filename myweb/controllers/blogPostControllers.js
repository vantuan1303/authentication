const { verifyJWT } = require('./userControllers')
const { BlogPost } = require('../model/BlogPost')

const insertBlogPost = async (title, content, tokenKey) => {
    try {
        //Check login with tokenKey
        let signedInUser = await verifyJWT(tokenKey)
        let newBlogPost = await BlogPost.create({
            title, content,
            date: Date.now(),
            author: signedInUser
        })
        await newBlogPost.save()
        await signedInUser.blogPosts.push(newBlogPost._id)
        await signedInUser.save()
        return newBlogPost
    } catch(error) {        
        throw error
    }
}

//Watching blog post with no token
const queryBlogPosts = async (text) => {
    try {        
        let blogPosts = await BlogPost.find({
            $or: [
                {
                    title: new RegExp(text, "i")
                    //i => ko phân biệt hoa/thường
                },
                {
                    content: new RegExp(text, "i")
                }
            ],                   
        })
        return blogPosts
    } catch(error) {        
        throw error
    }
}
//Get blogPost from date A to date B
//VD1: http://127.0.0.1:3000/blogposts/queryBlogPostsByDateRange?from=01-11-2018&to=05-11-2018
const queryBlogPostsByDateRange = async (from, to) => {
    //format: dd-mm-yyyy    
    let fromDate = new Date(parseInt(from.split('-')[2]), 
                            parseInt(from.split('-')[1])-1, 
                            parseInt(from.split('-')[0]))
    let toDate = new Date(parseInt(to.split('-')[2]), 
                            parseInt(to.split('-')[1])-1, 
                            parseInt(to.split('-')[0]))            
    try {                
        let blogPosts = await BlogPost.find({
            date: {$gte: fromDate, $lte: toDate}, 
            //$gte="greater than or equal", $lte="less than or equal"           
        })        
        return blogPosts
    } catch(error) {        
        throw error
    }
}
//Get detail blogPost with no token 
const getDetailBlogPost = async (blogPostId) => {
    try {        
        let blogPost = await BlogPost.findById(blogPostId)
        if (!blogPost) {
            throw `Không tìm thấy blogpost với Id=${blogPostId}`
        }
        return blogPost
    } catch(error) {        
        throw error
    }
}
//Update 1 blogpost => require token
//Only author can be update author's blog
const updateBlogPost = async (blogPostId,updatedBlogPost,tokenKey) => {
    try {        
        let signedInUser = await verifyJWT(tokenKey)
        let blogPost = await BlogPost.findById(blogPostId)
        if (!blogPost) {
            throw `Không tìm thấy blogpost với Id=${blogPostId}`
        }
        if (signedInUser.id !== blogPost.author.toString()) {
            throw "Ko update được vì bạn ko phải là tác giả bài viết"
        }
        blogPost.title = !updatedBlogPost.title ?
                            blogPost.title : updatedBlogPost.title
        blogPost.content = !updatedBlogPost.content ? 
                            blogPost.content : updatedBlogPost.content
        blogPost.date = Date.now()
        await blogPost.save()        
        return blogPost
    } catch(error) {        
        throw error
    }
}
//Delete blogPost
//1. Delete a record in BlogPosts
//2. Update reference field "blogPosts" in Users
//=> mảng blogPosts bớt đi 1 phần tử
const deleteBlogPost = async (blogPostId, tokenKey) => {
    try {        
        let signedInUser = await verifyJWT(tokenKey)
        let blogPost = await BlogPost.findById(blogPostId)
        if (!blogPost) {
            throw `Can not find blogPost with Id=${blogPostId}`
        }
        if (signedInUser.id !== blogPost.author.toString()) {
            throw "Can not delete record because you are not author"
        }
        await BlogPost.deleteOne({_id: blogPostId})
        signedInUser.blogPosts = await signedInUser.blogPosts
                                 .filter(eachBlogPost => {
            return blogPost._id.toString() !== eachBlogPost._id.toString()
        })
        await signedInUser.save()
    } catch(error) {        
        throw error
    }
}

module.exports = {
    insertBlogPost,
    queryBlogPosts,
    queryBlogPostsByDateRange,
    getDetailBlogPost,
    updateBlogPost,
    deleteBlogPost
}