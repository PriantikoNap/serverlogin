const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt')
const jwtgen = require('../utils/jwtGenerator');
const authorization = require('../middleware/authorization')

router.post('/register', async(req, res) =>{
    try {
        //step nya
        // destuktor body
        //check di db apa username sama email ada
        //bcryptin password
        //masukin ke db
        //generate jwtnya

        const {name, email, password} = req.body;

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        // res.json(user.rows)
        if(user.rows.length !== 0){
            res.status(401).send("email has been exist")
        }else{
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound);
        const criptoPassword = await bcrypt.hash(password, salt)

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *",[name, email, criptoPassword])
        const token = jwtgen(newUser.rows[0].user_id);
        res.json({token})
    }
         
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

router.post('/login', async(req, res)=>{
    try {
        //destruksi body nya
        //check di db ada atau engga

        const {email, password} = req.body;

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email]);
        if (user.rows.length ===0) {
            return res.status(401).json("user data not found, please signup to login")
        } else {
            const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
            if (!validPassword) {
                return res.status(401).json("wrong email or password")
            }
            const token = jwtgen(user.rows[0].user_id);
            res.json({token})
            
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

router.get('/is-valid', authorization, async (req, res)=>{
try {
    res.json(true)
} catch (err) {
    console.error(err.message);
    res.status(500).send("Not Authorize");
}
})

module.exports = router;