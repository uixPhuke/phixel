const express=require('express')
const app=express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors=require('cors')
const fileUpload = require("express-fileupload");

const connectDB = require('./config/db')
const userRoutes=require('./routes/userRoutes')
const addressRoutes=require('./routes/addressRoutes')
const productRoutes=require('./routes/productRoutes')
const cartRoutes=require('./routes/cartRoutes')
const contactRoutes=require('./routes/contactRoutes')
const wishlistRoutes=require('./routes/wishlistRoutes')
const discountRoutes=require('./routes/discountRoutes')
const orderRoutes=require('./routes/orderRoutes')

const PORT=process.env.PORT
const URL=process.env.FRONTEND_URL

//connect to database
connectDB()


app.set("trust proxy", 1);
//pass the middleware
app.use(
  cors({
    origin: URL, // frontend URL
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser());

app.use(express.urlencoded({extended:true}))
console.log("URL:", URL);

//start server
app.listen(PORT,()=>{
    console.log(`Server is running on PORT: http://localhost:${PORT}`)
}
)
//api routes
app.get('/',(req,res)=>{
    res.send('<h1>Welcome to the server</h1>')
}
)
//other routes
app.use('/api/v1/user',userRoutes)
app.use('/api/v2/address',addressRoutes)
app.use('/api/v3/product',productRoutes)
app.use('/api/v4/cart',cartRoutes)
app.use('/api/v5/discount',discountRoutes)
app.use('/api/v6/order',orderRoutes)
app.use('/api/v7/contact',contactRoutes)
app.use('/api/v8/wishlist',wishlistRoutes)