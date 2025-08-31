import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'Product',
    initialState: {
        loading: false,
        error: null,
        product: {},
        products: [],
        productsAdmin: [],
        productAdmin: {
            productID: "",
            title: "",
            desc: "",
            img:[],
            price: "",
            category: "",
            gender: "",
            stock: 0,
            availableState: false,
            madeToOrder: false,
            popular: false,
            createdAt: "",
            updatedAt: "",
            UserId: ""

        },
        product: {
            productID: "",
            title: "",
            desc: "",
            img:[],
            price: "",
            category: "",
            gender: "",
            stock: 0,
            availableState: false,
            madeToOrder: false,
            popular: false,
            createdAt: "",
            updatedAt: "",
            UserId: ""

        },
    },
    reducers: {
        getProductsRequest: (state) => {
            state.loading = true;
        },
        getProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
        },
        getProductsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createProductRequest: (state) => {
            state.loading = true
        },
        createProductSuccess: (state) => {
            state.loading = false
        },
        createProductFail: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },

        getProductsAdminRequest: (state) => {
            state.loading = true
        },
        getProductsAdminSuccess: (state, action) => {
            state.loading = false
            state.productsAdmin = action.payload
        },
        getProductsAdminFail: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },

        updateProductAdminRequest: (state) => {
            state.loading = true
        },
        updateProductAdminSuccess: (state) => {
            state.loading = false
        },
        updateProductAdminFail: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },

        deleteProductAdminRequest: (state) => {
            state.loading = true
        },
        deleteProductAdminSuccess: (state) => {
            state.loading = false
        },
        deleteProductAdminFail: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },

        getProductAdminRequest: (state) => {
            state.loading = true
        },
        getProductAdminSuccess: (state, action) => {
            state.loading = false;
            state.productAdmin = action.payload
        },
        getProductAdminFail: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },

        getProductRequest: (state) => {
            state.loading = true
        },
        getProductSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload
        },
        getProductFail: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },


    }
})

export const { createProductRequest, createProductSuccess, createProductFail,
    getProductsAdminRequest, getProductsAdminSuccess, getProductsAdminFail,
    updateProductAdminRequest, updateProductAdminSuccess, updateProductAdminFail,
    deleteProductAdminRequest, deleteProductAdminSuccess, deleteProductAdminFail,
    getProductAdminRequest, getProductAdminSuccess, getProductAdminFail,
    getProductRequest, getProductSuccess, getProductFail, getProductsRequest,
    getProductsSuccess,
    getProductsFail,
} = productSlice.actions


export default productSlice.reducer