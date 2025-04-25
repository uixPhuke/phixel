const express=require('express')
const app=express()
require('dotenv').config()

const connectDB = require('./config/db')
const PORT=process.env.PORT

//connect to database
connectDB()

//start server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
}
)
//api routes
app.get('/',(req,res)=>{
    res.send('Hello World!')
}
)