const express = require('express');
const app = express()
const cors = require('cors');

//MIDDLEWARE TARUH SINI

app.use(express.json());
app.use(cors());


//ROUTES

app.use('/auth', require('./routes/jwtAuth'))
app.use('/dashboard', require('./routes/dahboard'))

app.listen(5100,()=>{
    console.log("Server Running On PORT 5100");
    
})