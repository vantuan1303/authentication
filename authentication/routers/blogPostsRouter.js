const express = require('express')
const router = express.Router()
const { 	
    insertBlogPost,	
    queryBlogPosts,
    queryBlogPostsByDateRange,
    getDetailBlogPost,
    updateBlogPost,
    deleteBlogPost
} = require('../controllers/blogPostControllers')

router.use((req, res, next) => {
    console.log('Time: ', Date.now()) //Time log
    next()
})
router.post('/insertBlogPost', async (req, res) =>{
    let {title, content} = req.body
    //Client phải gửi tokenKey
    let tokenKey = req.headers['x-access-token']
    try {
        let newBlogPost = await insertBlogPost(title, content, tokenKey)
        res.json({
            result: 'ok',
            message: 'Create new blog successfully!',
            data: newBlogPost
        })
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Can not create blog. Error : ${error}`
        })
	}
})

router.get('/queryBlogPosts', async (req, res) => {
    let { text } = req.query
    try {
        let blogPost = await queryBlogPosts(text)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: blogPost
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Post not found: ${error}`
        })
    }
})

router.get('/queryBlogPostsByDateRange', async (req, res) => {
    let { from, to } = req.query
    try {
        let blogPosts = await queryBlogPostsByDateRange(from, to)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: blogPosts
        })

    } catch(error){
        res.json({
            result: 'failed',
            message: `Post not found: ${error}`
        })
    }
})

router.get('/getDetailBlogPost', async (req, res) => {
    let { blogPostId } = req.query
    try {
        let blogPost = await getDetailBlogPost(blogPostId)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: blogPost
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Post not found: ${error}`
        })
    }
})

router.put('/updateBlogPost', async (req, res) => {
    let { id } = req.body
    let tokenKey = req.headers['x-access-token']
    let updatedBlogPost = req.body
    try {
        let blogPost = await updateBlogPost(id, updatedBlogPost, tokenKey)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: blogPost
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Can not update blogpost: ${error}`
        })
    }
})

router.delete('/deleteBlogPost', async (req, res) => {
    let { id } = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        await deleteBlogPost(id, tokenKey)
        res.json({
            result: 'ok',
            message: 'Delete blog post successfully',
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Can not update blogpost: ${error}`
        })
    }
})

module.exports = router