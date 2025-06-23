import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "AED";
    const delivery_fee = 5;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const vat_rate = 5;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();


    const addToCart = async (itemId, size) => {
        const product = products.find((prod) => prod._id === itemId);
        if (!product) {
            toast.error("Product not found.");
            return;
        }

        const hasSizeOptions = Array.isArray(product.sizes) && product.sizes.length > 0;

        if (hasSizeOptions && !size) {
            toast.error("Please select a size!");
            return;
        }

        let cartData = structuredClone(cartItems);

        if (hasSizeOptions) {
            if (!cartData[itemId]) cartData[itemId] = {};
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = (typeof cartData[itemId] === "number" ? cartData[itemId] + 1 : 1);
        }

        setCartItems(cartData);

        toast.success("Item added to cart!", {
            position: "top-right",
            theme: "colored",
        });

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size: hasSizeOptions ? size : null }, { headers: { token } });
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };




    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItems) {
            const itemData = cartItems[itemId];

            if (typeof itemData === "object") {
                // Product with sizes
                for (const size in itemData) {
                    totalCount += itemData[size];
                }
            } else if (typeof itemData === "number") {
                // Product without sizes
                totalCount += itemData;
            }
        }

        return totalCount;
    };



    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        if (size) {
            // Product has size variants
            if (!cartData[itemId]) cartData[itemId] = {};
            cartData[itemId][size] = quantity;
        } else {
            // Product without sizes
            cartData[itemId] = quantity;
        }

        // Update state
        setCartItems(cartData);

        // Sync with server if user is logged in
        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/update',
                    { itemId, size, quantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Error updating cart:", error);
            }
        }
    };




    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) continue;

            // Handle products with sizes
            if (Array.isArray(itemInfo.sizes) && itemInfo.sizes.length > 0) {
                for (const size in cartItems[itemId]) {
                    const quantity = cartItems[itemId][size];
                    if (quantity > 0) {
                        let price = 0;
                        const sizeObj = itemInfo.sizes.find(s => s.size === size);
                        price = sizeObj ? sizeObj.price : 0;
                        totalAmount += price * quantity;
                    }
                }
            }
            // Handle products without sizes
            else if (typeof itemInfo.price === "number") {
                const quantity = cartItems[itemId];
                if (quantity > 0) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }

        return totalAmount;
    };



    const getProductData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    const getUserCart = async (token) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData)

            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }


    useEffect(() => {
        getProductData()
    }, [])


    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(!token && localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [])

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        const savedToken = localStorage.getItem('token');

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        if (savedToken) {
            setToken(savedToken);
            getUserCart(savedToken);
        }

        getProductData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);



    const value = {
        products, currency, delivery_fee, vat_rate,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    };

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
