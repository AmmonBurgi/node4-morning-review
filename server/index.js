require('dotenv').config()
    const express = require('express'),
        cors = require('cors'),
        {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
        massive = require('massive'),
        app = express(),
        port = SERVER_PORT,
        middleware = require('./middleware/middleware'),
        session = require('express-session'),
        authCtrl = require('./controllers/authController')

app.use(express.json())
app.use(cors())

app.use(session({
    resave: false, 
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
    console.log('db connected')
})

app.post('/auth/register', middleware.checkUsername, authCtrl.register)
app.post('/auth/login', middleware.checkUsername, authCtrl.login)
app.post('/auth/logout', authCtrl.logout)
app.get('/auth/user', authCtrl.getUser)

app.listen(port, () => console.log(`listening on port ${port}`))