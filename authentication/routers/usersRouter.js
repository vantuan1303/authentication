const express = require('express')
const router = express.Router()
const { 
	insertUser, 
	activateUser, 
	verifyJWT,
	loginUser,
	blockOrDeleteUsers
} = require('../controllers/userControllers')

router.use((req, res, next) => {
    console.log('Time: ', Date.now()) //Time log
    next()
})
router.post('/registerUser', async (req, res) =>{
	res.setHeader('Access-Control-Allow-Origin', '*')
	let {name, email, password} = req.body   
    try {
        await insertUser(name, email, password)
	  	res.json({
	  		result: 'ok',
	  		message: 'Đăng ký user thành công, bạn cần mở mail để kích hoạt'
	  	})		
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Không thể đăng ký thêm user. Lỗi : ${error}`
        })
	}
})
//router active user
//VD:
//http://Nguyens-iMac:3000/users/activateUser?secretKey=$2b$10$U4iDuK4aJ0.QSvVfRy8g/uvmSCUB0B8KfX75uUj8qr3xudHXcDG7y&email=nodejst9@gmail.com
router.get('/activateUser', async (req, res) =>{	
	let {email, secretKey} = req.query	
	try {
		await activateUser(email, secretKey)
		res.send(`<h1 style="color:MediumSeaGreen;">Active user successfully</h1>`)
	} catch(error) {
		res.send(`<h1 style="color:Red;">Can not active user. Error: ${error}</h1>`)
	}
})
router.post('/loginUser', async (req, res) =>{	
	let {email, password} = req.body
    try {
		let tokenKey = await loginUser(email, password)
		res.json({
			result: 'ok',
			message: 'Login user successfully!',
			tokenKey
	  	})
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Login user error : ${error}`
        })
	}
})
//Write a API test token key"
router.get('/jwtTest', async (req, res) => {		
	let tokenKey = req.headers['x-access-token']
    try {
		//Verify token
		await verifyJWT(tokenKey)
		res.json({
			result: 'ok',
			message: 'Verify Json Web Token successully',	  		
	  	})	
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Error check token : ${error}`
        })
	}
})

router.post('/admin/blockOrDeleteUsers', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
	let { userIds, actionType } = req.body
	userIds = userIds.split(',') //Convert string to array
    try {
        await blockOrDeleteUsers(userIds, tokenKey, actionType)
        res.json({
            result: 'ok',
            message: 'Block or delete user successfully!'
        })
    } catch(error) {
        res.json({
            result: 'failed',
            message: `Error block/delete user: ${error}`
        })
    }
})
module.exports = router