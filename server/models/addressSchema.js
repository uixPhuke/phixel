const mongoose=require('mongoose')
const { use } = require('../routes/userRoutes')

const addresssSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true       
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pinCode:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    isDefault:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


const Address=mongoose.model('Address',addresssSchema)
module.exports=Address
