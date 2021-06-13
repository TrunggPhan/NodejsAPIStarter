const express = require('express')
const logger = require('morgan')
const mongoClient = require('mongoose')
const bodyParser = require('body-parser')

const app = express();

//Connect DB
mongoClient.connect("mongodb+srv://testdb:testdb@cluster0.sdh97.mongodb.net/NodejsApiStarter?retryWrites=true&w=majority", {
// mongoClient.connect("mongodb://localhost/nodejsapistarter", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => { console.log('✅  Ket noi MongoDB thanh cong!!!')}) //nhap emoji macbook (control + command + space)
      .catch((error) => { console.error('❌  Ket noi MongoDB that bai voi error : ', error) })

//MiddleWare
app.use(logger('dev'))
app.use(bodyParser.json())

//Router
const userRoute = require('./routes/user')
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
// app.use((err, res)=> {
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


