import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';
import '../style.css'
import "../mobile.css";
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {

    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState({});

    const handleSizeChange = (productId, newSize) => {
        setSelectedSizes((prev) => ({
            ...prev,
            [productId]: newSize
        }));
    };

    useEffect(() => {
        if (products.length > 0) {

            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

            setRelated(productsCopy.slice(0, 5));
        }
    }, [products])


    return (
        <div className='related-products-container'>
            <div className='"related-title'>
                <Title text1={'RELATED'} text2={'PRODUCTS :'} />
            </div>

            <div className='related-products-grid'>
                {
                    related.map((item, index) => {
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
                            <div key={index} className='related-product-item'>
                                <ProductItem
                                    id={item._id}
                                    name={item.name}
                                    price={price}
                                    image={item.image}
                                />
                            </div>
                        );
                    })
                }


            </div>

        </div>
    )
}

export default RelatedProducts
