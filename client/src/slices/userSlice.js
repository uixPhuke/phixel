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
        registerSuccess:(state)=>{
            state.authLoading=false;
        },
        registerFail:(state,action)=>{
            state.authLoading=false;
            state.error= action.payload;
        },
        loginRequest: (state) => {
            state.authLoading = true;
        },
        loginSuccess: (state) => {
            state.authLoading = false;
        },
        loginFail: (state, action) => {
            state.authLoading = false;
            state.error = action.payload || 'Please login first to access this page';
        },

        verifyLoginRequest: (state) => {
            // state.loading = true
            state.authLoading = true;
        },
        verifyLoginSuccess: (state, action) => {
            state.isLogin = action.payload.isLogin;
            state.authLoading = false;
            state.user = action.payload.user;
        },
        verifyLoginFail: (state, action) => {
            state.isLogin = false;
            state.authLoading = false;
            state.error = action.payload || 'Please login first to access this page';
        },

        getUserRequest: (state) => {
            state.loading = true;
        },
        getUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        getUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        editUserRequest: (state) => {
            state.loading = true;
        },
        editUserSuccess: (state) => {
            state.loading = false;
        },
        editUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setShowLoginModalTrue: (state) => {
            state.showLoginModal = true;
        },
        setShowLoginModalFalse: (state) => {
            state.showLoginModal = false;
        },

        // Reducers for fetching all users
        getUsersRequest: (state) => {
            state.loading = true;
        },
        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.allUsers = action.payload;
        },
        getUsersFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    registerRequest,
    registerSuccess,
    registerFail,
    loginRequest,
    loginSuccess,
    loginFail,
    verifyLoginRequest,
    verifyLoginSuccess,
    verifyLoginFail,
    getUserRequest,
    getUserSuccess,
    getUserFail,
    editUserRequest,
    editUserSuccess,
    editUserFail,
    setShowLoginModalTrue,
    setShowLoginModalFalse,
    getUsersRequest,
    getUsersSuccess,
    getUsersFail,
} = userSlice.actions;

export default userSlice.reducer;