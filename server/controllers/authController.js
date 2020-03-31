const bcrypt = require('bcryptjs')

module.exports = {
    register: async(req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        let newUser = await db.check_user(username)

        if(newUser[0]){
           return res.status(400).send('User already created')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let user = await db.register_user(username, hash)
        req.session.user = user[0]
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        let user = await db.check_user(username)

        if(!user[0]){
           return res.status(401).send('Username not found')
        }

        let authenticated = bcrypt.compareSync(password, user[0].password)

        if(!authenticated){
            return res.status(400).send('Password is incorrect')
        }
        delete user[0].password

        req.session.user = user
        res.status(202).send(req.session.user)
    
    },
    logout: (req, res) => {
        req.session.destroy()
        res.status(200)
    },
    getUser: (req, res) => {
        if(req.session.user){
         req.status(200).send(req.session.user)
        } else {
            req.status(204).send('Please login or register')
        }
    }
}