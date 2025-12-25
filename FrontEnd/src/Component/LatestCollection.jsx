import React, { useContext, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import '../style.css';
import "../mobile.css";

const LatestCollection = () => {
    const { products = [] } = useContext(ShopContext);
    const [selectedSizes, setSelectedSizes] = useState({});

    const handleSizeChange = (productId, newSize) => {
        setSelectedSizes(prev => ({
            ...prev,
            [productId]: newSize
        }));
    };

    // Derived data — no useEffect needed
    const latestProducts = Array.isArray(products) ? products.slice(0, 10) : [];

    return (
        <div className="latest-collection">
            <div className="latestcollectiontitle-container">
                <Title text1="LATEST" text2="COLLECTIONS: " />
                <p className='text-paragraph'>
                    Explore our latest collection of premium building materials, from durable wood to modern hardware.
                    <br />
                    Designed for strength and style, our new range ensures top-quality building materials solutions.
                </p>
            </div>

            <div className='latest-collection-container'>
                <div className='product-grid'>
                    {latestProducts.map((item) => {
                        const defaultSize = Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes[0].size : null;
                        const selectedSize = selectedSizes[item._id] || defaultSize;

                        let price = 0;

                        if (Array.isArray(item.sizes) && item.sizes.length > 0 && selectedSize) {
                            const selectedSizeObj = item.sizes.find(sizeObj => sizeObj.size === selectedSize);
                            price = selectedSizeObj ? selectedSizeObj.price : 'N/A';
                        } else if (typeof item.price === "number") {
                            price = item.price;
                        }

                        return (
                            <div key={item._id} className="product-item">
                                <ProductItem
                                    id={item._id}
                                    image={item.image}   // ProductItem handles array
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

export default LatestCollection;

