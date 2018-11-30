const bcrypt = require('bcrypt')
const {sendEmail} = require('../helpers/utility')
const jwt = require('jsonwebtoken')//Mã hoá 1 jsonObject thành token(string)
const secretString = "secret string"//tự cho 1 string tuỳ ý
const ACTION_BLOCK_USER = "ACTION_BLOCK_USER" //Khoá tài khoản
const ACTION_DELETE_USER = "ACTION_DELETE_USER"//Xoá tài khoản
const { User } = require('../model/User')
const { deleteBlogPostsByAuthor } = require('./deleteBlogPostsByAuthor')

const insertUser = async (name, email, password) => {
    try {
    	//Mã hoá password trước khi lưu vào DB
	    const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword        
        await newUser.save()
        await sendEmail(email, encryptedPassword)
    } catch(error) {
        //Tự tuỳ chỉnh lại Error
        if (error.code === 11000) {
        	throw "Tên hoặc email đã tồn tại"
        }
        //throw error
    }
}
//Hàm activeUser dùng 1 GET request
//VD:
//http://Nguyens-iMac:3000/users/activateUser?secretKey=$2b$10$U4iDuK4aJ0.QSvVfRy8g/uvmSCUB0B8KfX75uUj8qr3xudHXcDG7y&email=nodejst9@gmail.com
const activateUser = async (email, secretKey) => {
    try {
        let foundUser = await User.findOne({email, password: secretKey})
                                .exec()
        if (!foundUser) {
            throw "Không tìm thấy User để kích hoạt"
        }    
        if(foundUser.isBanned === 1) {
            throw "User đã bị khoá tài khoản, do vi phạm điều khoản"
        }
        if (foundUser.active === 0) {
            foundUser.active = 1
            await foundUser.save()            
        } else {
            throw "User đã kích hoạt"//foundUser.active = 1
        }
    } catch(error) {        
        throw error       
    }
}
//Viết hàm login user
const loginUser = async (email, password) => {
    try {
        let foundUser = await User.findOne({email: email.trim()})
                            .exec()
        if(!foundUser) {
            throw "User không tồn tại"
        }
        if(foundUser.isBanned === 1) {
            throw "User đã bị khoá tài khoản, do vi phạm điều khoản"
        }
        if(foundUser.active === 0) {
            throw "User chưa kích hoạt, bạn phải mở mail kích hoạt trước"               
        }
        let encryptedPassword = foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)
        if (checkPassword === true) {
            //Đăng nhập thành công
            let jsonObject = {
                id: foundUser._id
            }
            let tokenKey = await jwt.sign(jsonObject, 
                                secretString, {
                                    expiresIn: 86400 // Expire trong 24 giờ
                                })
            return tokenKey
        }
    } catch(error) {
        throw error
    }
}
const verifyJWT = async (tokenKey) => {
    try {          
        let decodedJson = await jwt.verify(tokenKey, secretString)
        if(Date.now() / 1000 >  decodedJson.exp) {
            throw "Token hết hạn, mời bạn login lại"
        }
        let foundUser = await User.findById(decodedJson.id)
        if (!foundUser) {
            throw "Ko tìm thấy user với token này"
        }
        if(foundUser.isBanned === 1) {
            throw "User đã bị khoá tài khoản, do vi phạm điều khoản"
        }
        return foundUser
    } catch(error) {
        throw error
    }                 
}

// Hàm dành riêng cho "admin"
const blockOrDeleteUsers = async (userIds, tokenKey, actionType) => {
    //Admin có thể xoá/khoá nhiều user một lúc
    try {
        let signedInUser = await verifyJWT(tokenKey)
        if (signedInUser.permission !== 2){
            throw "Chỉ có tài khoản admin mới có chức năng này"
        }
        userIds.forEach(async (userId) => {
            let user = await User.findById(userId)
                if (!user) { //Ko thấy user
                    return
                }
                //Xoá hay block ?
                if(actionType === ACTION_BLOCK_USER) {
                    user.isBanned = 1
                    await user.save()
                } else if (actionType === ACTION_DELETE_USER) {
                    //Gồm 2 bước:
                    //1. Xoá các blogposts của user
                    await deleteBlogPostsByAuthor(userId)
                    //2. Xoá user
                    await User.findByIdAndDelete(userId)
                } 
        })
    } catch(error) {
        throw error
    }
}

module.exports = {
    insertUser, 
    activateUser, 
    loginUser, 
    verifyJWT,
    blockOrDeleteUsers
}