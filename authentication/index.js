const express = require('express')
const app = express()
const http = require('http')
//Use winston to store error log
const winston = require('winston')
const { PORT, HOST } = require('./helpers/utility')
// Logger
const logger = winston.createLogger({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: '../logs/weblog.log' })
    ]
})

//Middleware static
app.use(express.static('public'))
//Middleware body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//Custom router
const usersRouter = require('./routers/usersRouter')
const blogPostRouter = require('./routers/blogPostsRouter')
const indexRouter = require('./routers/index')
app.use('/users', usersRouter)
app.use('/blogPosts', blogPostRouter)
app.use('/', indexRouter)

const server = http.createServer(app)
//Catch express when run
server.on('error', (error) => {
    logger.log('error', error)
    // console.log(error)
})

//Start server
// app.listen(PORT, () => {
//     console.log(`Listeing at port: ${PORT}`)
// })
server.listen(PORT, HOST, () => {
    logger.log('info', `Server is starting at ${new Date()}`)
})

console.log(`Running on: ${HOST}:${PORT}`)