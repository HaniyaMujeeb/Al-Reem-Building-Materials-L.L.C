import React from 'react';
import { assets } from '../assets/assets';
import { useState } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify'

const Add = ({ token }) => {

    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState("MDF");
    const [subCategory, setSubCategory] = useState("MDF Sheets");
    const [sizes, setSizes] = useState([]);
    const [productCode, setProductCode] = useState('');

    const [bestseller, setBestseller] = useState(false);


    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData()

            formData.append("name", name)
            formData.append("productCode", productCode);
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("sizes", JSON.stringify(sizes))

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendURL + "/api/product/add", formData, { headers: { token } })

            if (response.data.message) {
                toast.success(response.data.message)
                setName('')
                setProductCode('');
                setDescription('')
                setImage1(false)
                setImage2(false)
                setImage3(false)
                setImage4(false)
                setPrice('')

            } else {
                toast.error(error.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }


    return (
        <form onSubmit={onSubmitHandler} className="add-form">
            {/* Image Upload Section */}
            <div>
                <p className="upload-title" > Upload Image : </p>
                <div className="image-upload-container" >
                    <label htmlFor="image1" className={`image-label ${image1 ? 'uploaded-label' : ''}`}>
                        <img className={`upload-icon ${image1 ? 'uploaded' : ''}`}
                            src={!image1 ? assets.image_upload : URL.createObjectURL(image1)} alt="" />
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>

                    <label htmlFor="image2" className={`image-label ${image2 ? 'uploaded-label' : ''}`}>
                        <img className={`upload-icon ${image2 ? 'uploaded' : ''}`}
                            src={!image2 ? assets.image_upload : URL.createObjectURL(image2)} alt="" />
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>

                    <label htmlFor="image3" className={`image-label ${image3 ? 'uploaded-label' : ''}`}>
                        <img className={`upload-icon ${image3 ? 'uploaded' : ''}`}
                            src={!image3 ? assets.image_upload : URL.createObjectURL(image3)} alt="" />
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>

                    <label htmlFor="image4" className={`image-label ${image4 ? 'uploaded-label' : ''}`}>
                        <img className={`upload-icon ${image4 ? 'uploaded' : ''}`}
                            src={!image4 ? assets.image_upload : URL.createObjectURL(image4)} alt="" />
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>
                </div>
            </div>

            {/* Product Name */}
            <div className='input-group'>
                <p className='input-label'>Product Name:</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='product-name-input' type='text' placeholder='Enter Product Name' required />
            </div>

            {/* Product Code */}
            <div className='input-group'>
                <p className='input-label'>Product Code:</p>
                <input
                    onChange={(e) => setProductCode(e.target.value)}
                    value={productCode}
                    className='product-code-input'
                    type='text'
                    placeholder='e.g. MDF-SHT-001'
                    required
                />
            </div>


            {/* Product Description */}
            <div className='input-group'>
                <p className='input-label'>Product Description:</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='product-description-input' placeholder='Enter Product Description' required />
            </div>

            {/* Product Category & Sub-Category */}
            <div className='input-row' >
                <div className='input-group' >
                    <p className='input-label' > Product Category: </p>

                    <select onChange={(e) => setCategory(e.target.value)} className='product-category-select' >
                        <option value="MDF"> MDF </option>
                        <option value="Plywood"> Plywood </option>
                        <option value="Aluminium Hardware"> Aluminium Hardware </option>
                        <option value="Flooring"> Flooring </option>
                        <option value="Hardware"> Hardware </option>
                    </select>

                </div>

                <div className='input-group' >
                    <p className='input-label' > Product Sub-Category: </p>

                    <select onChange={(e) => setSubCategory(e.target.value)} className='product-subcategory-select'>
                        <option value="MDF Sheets" > MDF Sheets </option>
                        <option value="PVC Panel" > PVC Panel </option>
                        <option value="Melamine MDF Sheets" > Melamine MDF Sheets </option>
                        <option value="Door Handles" > Door Handles </option>
                        <option value="Door Accessories" > Door Accessories </option>
                        <option value="Hinges" > Hinges </option>
                        <option value="Plywood Sheets" > Plywood Sheets </option>
                        <option value="Commercial Plywood" > Commercial Plywood </option>
                        <option value="PVC High Glossy MDF Panel" > PVC High Glossy MDF Panel </option>
                        <option value="PVC Soft Touch MDF Panel" > PVC Soft Touch MDF Panel </option>
                        <option value="Chevron Flooring" > Chevron Flooring </option>
                        <option value="Wooden Floor Tile"> Wooden Floor Tile </option>
                        <option value="Door Locks" > Door Locks </option>
                        <option value="Door Closer" > Door Closer </option>
                        <option value="Glass Door Accessories" > Glass Door Accessories </option>
                        <option value="Silicone & Adhesives" > Silicone & Adhesives </option>
                        <option value="Other Hardware Accessories" >  Other Hardware Accessories </option>
                    </select>

                </div>

                {/* Product Price */}
                <div className='input-group'>
                    <p className='input-label'>Product Price:</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='product-price-input' type='number' placeholder='25' />
                </div>
            </div>

            {/* Product Sizes */}

            <div className="size-container">
                <p className="input-label"> Product Sizes & Prices: </p>
                <div className="size-options">

                    {["3mm", "4mm", "6mm", "9mm", "12mm", "15mm", "18mm", "25mm"].map((size) => {
                        const existingSize = sizes.find(item => item.size === size);

                        return (
                            <div key={size} className="size-item">
                                <p onClick={() => {
                                    if (existingSize) {
                                        setSizes(sizes.filter(item => item.size !== size));
                                    } else {
                                        setSizes([...sizes, { size, price: "" }]);
                                    }
                                }} className={`size-box ${existingSize ? "selected" : ""}`}>
                                    {size}
                                </p>

                                {existingSize && (
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={existingSize.price}
                                        onChange={(e) => {
                                            setSizes(sizes.map(item => item.size === size ? { ...item, price: e.target.value } : item));
                                        }}
                                        className="size-price-input"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Bestseller Checkbox */}
            <div className='checkbox-container'>
                <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type='checkbox' id='bestseller' className="bestseller-checkbox" />
                <label htmlFor='bestseller' className="bestseller-label"> Add to BestSeller </label>
            </div>

            {/* Submit Button */}
            <button type='submit' className='submit-button'> ADD PRODUCT </button>
        </form>
    );
};

export default Add;
