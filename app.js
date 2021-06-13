const express = require('express')
const logger = require('morgan')

const app = express();

//MiddleWare
app.use(logger('dev'))

const userRoute = require('./routes/user')

//Router
app.use('/users', userRoute)

//Router
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is OK!!!'
    })
})

//Catch 404 and forward them to error handle
app.use((req, res,next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

//Error handle function
app.use((req, res,next)=> {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500
    //response to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

//Start Server
const port = app.get('port') || 3000
app.listen(port, () => {console.log("App is listening in port : ", port)})


