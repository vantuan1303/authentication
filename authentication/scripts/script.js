const { User } = require('../model/User')

const makeUserBecomeAdmin = async (userId) => {
    try {
        let foundUser = await User.findById(userId)
        if (!foundUser) {
            console.log('Không tìm thầy user với ID: ' + userId)
        }
        foundUser.permission = 2
        foundUser.isBanned = 0
        foundUser.active = 1
        await foundUser.save()
        console.log(`Đã bỏ nhiệm ${foundUser.name} làm admin`)
    } catch(error){
        console.log(`Có lỗi xảy ra: ${error}`)
    }
}

makeUserBecomeAdmin('5bffab4033cd8f93cf967228')