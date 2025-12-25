import React, { useContext, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import "../mobile.css";

const BestSeller = () => {
    const { products = [] } = useContext(ShopContext);
    const [selectedSizes, setSelectedSizes] = useState({});

    const handleSizeChange = (productId, newSize) => {
        setSelectedSizes(prev => ({
            ...prev,
            [productId]: newSize
        }));
    };

    // Derived data — no useEffect needed
    const bestSeller = Array.isArray(products) 
        ? products.filter(item => item.bestseller).slice(0, 6) 
        : [];

    return (
        <div className='best-sellers-container'>
            <div className='text-section'>
                <Title text1="BEST" text2="SELLERS:" />
            </div>

            <div className='description'>
                <p>
                    Explore our best-selling building materials, including MDF sheets, plywood, and gypsum boards,
                    designed for durability, strength, and affordability. <br /> Perfect for residential, commercial, and industrial
                    projects—build with confidence!
                </p>
            </div>

            <div className='bestsellergrid-container'>
                <div className='best-seller-grid'>
                    {bestSeller.map((item) => {
                        const defaultSize = Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes[0].size : null;
                        const selectedSize = selectedSizes[item._id] || defaultSize;

                        let price = 'N/A'; 

                        if (Array.isArray(item.sizes) && item.sizes.length > 0 && selectedSize) {
                            const selectedSizeObj = item.sizes.find(sizeObj => sizeObj.size === selectedSize);
                            price = selectedSizeObj ? selectedSizeObj.price : 'N/A';
                        } else if (typeof item.price === "number") {
                            price = item.price;
                        }

                        return (
                            <div key={item._id} className='bestseller-item'>
                                <ProductItem
                                    id={item._id}
                                    image={item.image}  // ProductItem handles array
                                    name={item.name}
                                    price={price}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BestSeller;


