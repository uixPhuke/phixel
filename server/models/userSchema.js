const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: function (v){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props=> `${props.value} is not a valid email!`
        }
    },
    phone:{
        type:String,
        required:true,
        validate: {
            validator: function (v){
                return /^\d{10}$/.test(v);
            },
            message: props=> `${props.value} is not a valid phone number!`
        }
    },
    dob:{
        type:Date,
        required:true,
        validate: {
            validator: function (v){
                return v <= new Date();
            },
            message: props=> `${props.value} is not a valid date of birth!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    
      },
      isAdmin: {
        type: Boolean,
        default: false,
    },

},{timestamps:true});

const User= mongoose.model("User",userSchema);
module.exports=User

