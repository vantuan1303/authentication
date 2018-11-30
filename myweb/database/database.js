// mongod --dbpath /Users/admin/api-crud/ --port 27018 --auth
const mongoose = require('mongoose')
const connectDatabase = async () => {
    try {
        let url = 'mongodb://tuan:12345678@127.0.0.1:27018/mongo-database'
        let options = {
            connectTimeoutMS: 10000,
            useNewUrlParser: true,
            useCreateIndex: true
        }
        mongoose.connect(url, options)
        console.log('Connect database successfully!')
    } catch(error) {
        console.log(`Connect database error: ${error}`)
    }
}
connectDatabase()
module.exports = {
    mongoose
}