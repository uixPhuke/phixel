import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'User',
    initialState:{
        loading :false,
        authLoading:false,
        error:null,
        isLogin:false,
        showLoginModal:false,
        showSignupModal:false,
        user:{
            userID:"",
            firstName:"",
            lastName:"",
            username:"",
            email:"",
            phone:"",
            dob:"",
            isAdmin:false,
            isFirebaseAuth:false,
            createdAt:"",
            updatedAt:"",

        },
        allUsers:[], //this is a new state to store all users
    },
    reducers:{
        registerRequest:(state)=>{
            state.authLoading=true;
        },
}