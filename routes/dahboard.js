const router = require('express').Router();
const pool = require('../db');
const authorize = require('../middleware/authorization');

router.get('/',authorize,async(req, res)=>{
    try {
        const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user])
        res.json(user.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports= router