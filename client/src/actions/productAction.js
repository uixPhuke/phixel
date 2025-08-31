import { useContext } from "react";
import axios from "axios";
import {
    createProductRequest,
    createProductSuccess,
    createProductFail,
    getProductsAdminRequest,
    getProductsAdminSuccess,
    getProductsAdminFail,
    updateProductAdminRequest,
    updateProductAdminSuccess,
    updateProductAdminFail,
    deleteProductAdminRequest,
    deleteProductAdminSuccess,
    deleteProductAdminFail,
    getProductAdminRequest,
    getProductAdminSuccess,
    getProductAdminFail,
    getProductRequest,
    getProductSuccess,
    getProductFail,
    getProductsRequest,
    getProductsSuccess,
    getProductsFail,
} from "../slices/productSlice";
import { toast } from "react-hot-toast";
// import { ClientIPContext } from "../context/ClientIPContext"

const API_KEY = import.meta.env.VITE_API_KEY;


// Admin Route
export const addProduct =
    (product, setProductData, formRef) => async (dispatch) => {
        try {
            dispatch(createProductRequest());

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };

            const { data } = await axios.post(
                `${API_KEY}/api/v2/product/admin/product/create`,
                product,
                config
            );

            dispatch(createProductSuccess());

            // **Clear cached products after update**
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("products_")) {
                localStorage.removeItem(key);
            }
        });

            toast.success("Product Added Successfully!", {
                className: 'custom-toast-enter',
            });

            setProductData({
                title: "",
                desc: "",
                imgs: [],
                totalPrice: "",
                costPrice: "",
                sellingPrice: "",
                category: "",
                sizes: [],
                fabricType:"",
                fitType:"",
                pattern:"",
                sleeveType:"",
                collarType:"",
                gender: "",
                color: "",
                stock: "",
                availableState: true,
                madeToOrder: false,
                popular: false,
                labor: "",
                packaging: "",
                countryTax: "",
                country: "",
                active: "active",
                productCode: "",
            });
            formRef.current.reset();
        } catch (err) {
            dispatch(createProductFail(err.response.data.message));
            console.log(err.response.data.message);
            toast.error(err.response.data.message, {
                className: 'custom-toast-enter',
            });
        }
    };

// Admin Routes
export const getProductsAdmin = () => async (dispatch) => {
    try {
        dispatch(getProductsAdminRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        const { data } = await axios.get(
            `${API_KEY}/api/v2/product/admin/products`,
            config
        );
        console.log("Fetched Products from the admin:", data.products); // Debug log
        dispatch(getProductsAdminSuccess(data.products));
    } catch (err) {
        dispatch(getProductsAdminFail(err.response.data.message));
        console.log(err.response.data.message);
        toast.error(err.response.data.message, {
            className: 'custom-toast-enter',
        });
    }
};

// Admin Routes
export const deleteProductAdmin = (productID) => async (dispatch) => {
    try {
        dispatch(deleteProductAdminRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        const { data } = await axios.delete(
            `${API_KEY}/api/v2/product/admin/product/delete/${productID}`,
            config
        );

        dispatch(deleteProductAdminSuccess());

        toast.success("Product removed successfully!", {
            className: 'custom-toast-enter',
        });
        dispatch(getProductsAdmin());
    } catch (err) {
        dispatch(deleteProductAdminFail(err.response.data.message));
        console.log(err.response.data.message);
        toast.error(`error of delete is ${err.response.data.message}`);
    }
};

// Admin Route
export const getProductAdmin = (productID) => async (dispatch) => {
    try {
        dispatch(getProductAdminRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        const { data } = await axios.get(
            `${API_KEY}/api/v2/product/admin/product/${productID}`,
            config
        );

        dispatch(getProductAdminSuccess(data.product));
    } catch (err) {
        dispatch(getProductAdminFail(err.response.data.message));
        console.log(err.response.data.message);
        toast.error(err.response.data.message, {
            className: 'custom-toast-enter',
        });
    }
};

// Admin Route
export const updateProductAdmin = (product, productID) => async (dispatch) => {
    try {
        dispatch(updateProductAdminRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        const { data } = await axios.put(
            `${API_KEY}/api/v2/product/admin/product/update/${productID}`,
            product,
            config
        );

        dispatch(updateProductAdminSuccess());
        dispatch(getProductAdmin(productID));

        // **Clear cached products after update**
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("products_")) {
                localStorage.removeItem(key);
            }
        });

        // **Update cache version to notify all users of new data**
        localStorage.setItem("products_cache_version", Date.now());

        toast.success("Product updated successfully!", {
            className: 'custom-toast-enter',
        });
    } catch (err) {
        dispatch(updateProductAdminFail(err.response.data.message));
        console.log(err.response.data.message);
        toast.error(err.response.data.message, {
            className: 'custom-toast-enter',
        });
    }
};

// Normal User Route
export const getProduct = (productID, clientIP) => async (dispatch, getState) => {
    try {
        const { product } = getState().product; // Get current Redux state

        // // Get cached product and timestamp
        // const cachedData = localStorage.getItem(`product_${productID}`);
        // const cacheTime = localStorage.getItem(`product_${productID}_timestamp`);

        // // Set cache expiration time (10 minutes)
        // const CACHE_EXPIRATION = 1 * 60 * 1000;

        // if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_EXPIRATION) {
        //     dispatch(getProductSuccess(JSON.parse(cachedData)));
        //     return;
        // }

        dispatch(getProductRequest());

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              
            },
        };

        const { data } = await axios.get(
            `${API_KEY}/api/v2/product/product/${productID}`,
            config
        );

        dispatch(getProductSuccess(data.product));

        // Store in localStorage with timestamp
        localStorage.setItem(`product_${productID}`, JSON.stringify(data.product));
        localStorage.setItem(`product_${productID}_timestamp`, Date.now());
    } catch (err) {
        dispatch(getProductFail(err.response.data.message));
    }
};


export const getAllProducts = (query, clientIP) => async (dispatch) => {
    try {
        dispatch(getProductsRequest());

        const cacheKey = `products_${query}`;
        const cachedProducts = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const cacheVersion = localStorage.getItem("products_cache_version") || 0;

        // Set cache expiration time (e.g., 10 minutes)
        const CACHE_EXPIRATION = 4 * 60 * 1000;

        // If cached data exists and is not expired, dispatch it from cache
        if (cachedProducts && cachedTimestamp && Date.now() - cachedTimestamp < CACHE_EXPIRATION && Number(cachedTimestamp) >= Number(cacheVersion)) {
            dispatch(getProductsSuccess(JSON.parse(cachedProducts)));
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                
            },
        };

        const { data } = await axios.get(`${API_KEY}/api/v2/product/products?${query}`, config);
        dispatch(getProductsSuccess(data.products));

        // Cache the response in localStorage with timestamp
        localStorage.setItem(cacheKey, JSON.stringify(data.products));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
    } catch (err) {
        dispatch(getProductsFail(err.response.data.message));
        console.log(err.response.data.message);
    }
};