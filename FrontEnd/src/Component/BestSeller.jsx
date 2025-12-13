import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import "../mobile.css";

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState({});

    const handleSizeChange = (productId, newSize) => {
        setSelectedSizes((prev) => ({
            ...prev,
            [productId]: newSize
        }));
    };

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 6));
    }, [products]);

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
                    {bestSeller.map((item, index) => {
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
                            <div key={index} className='bestseller-item'>
                                <ProductItem
                                    id={item._id}
                                    image={item.image}
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


