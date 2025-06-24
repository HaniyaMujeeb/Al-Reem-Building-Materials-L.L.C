import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title';
import '../style.css'
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products = [] } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState({});

    const handleSizeChange = (productId, newSize) => {
        setSelectedSizes((prev) => ({
            ...prev,
            [productId]: newSize
        }));
    };

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products])

    return (
        <div className="latest-collection">
            <div className="latestcollectiontitle-container">
                <Title text1="LATEST" text2="COLLECTIONS " />
                <p className='text-paragraph'>
                    Explore our latest collection of premium building materials, from durable wood to modern hardware <br></br>
                    Designed for strength and style, our new range ensures top-quality building materials  solutions.
                </p>

                <div className='title-line'> </div>
            </div>

            { /* Calling Products */}

            <div className='latest-collection-container'>
                <div className='product-grid'>
                    {
                        latestProducts.map((item, index) => {
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
                                <div key={index} className="product-item">
                                    <ProductItem
                                        id={item._id}
                                        image={item.image}
                                        name={item.name}
                                        price={price}
                                    />
                                </div>
                            );
                        })
                    }


                </div>

            </div>


        </div>
    )
}



export default LatestCollection
