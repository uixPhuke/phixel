const express=require('express')
const app=express()
require('dotenv').config()

const connectDB = require('./config/db')
const userRoutes=require('./routes/userRoutes')
const PORT=process.env.PORT

//connect to database
connectDB()

//pass the middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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
//other routes
app.use('/api/users',userRoutes)