const express=require('express')
const app=express()
require('dotenv').config()
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db')
const userRoutes=require('./routes/userRoutes')
const PORT=process.env.PORT

//connect to database
connectDB()

//pass the middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

//start server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
}
)
//api routes
app.get('/',(req,res)=>{
    res.send('<h1>Welcome to the server</h1>')
}
)
//other routes
app.use('/api/users',userRoutes)