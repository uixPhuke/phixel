import mongoose from "mongoose";

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
   password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
          validator: function (value) {
            return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
          },
          message: 'Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long'
        }
      },
      isAdmin: {
        type: Boolean,
        default: false,
    },

},{timestamps:true});

const User= mongoose.model("User",userSchema);
export default User;
