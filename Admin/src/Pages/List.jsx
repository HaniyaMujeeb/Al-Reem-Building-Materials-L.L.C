import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendURL, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
    const [list, setList] = useState([])

    // Fetch Product List from Backend
    const fetchList = async () => {
        try {
            const response = await axios.get(backendURL + '/api/product/list')
            if (response.data.success) {
                // Ensure we set an array, fallback to empty array
                setList(Array.isArray(response.data.data) ? response.data.products : [])
            } else {
                setList([])
                toast.error(response.data.message)
            }
        } catch (error) {
            setList([])
            console.log(error)
            toast.error(error.message)
        }
    }

    // Remove Product Function
    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendURL + '/api/product/remove', { id }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList() // Refresh list
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <>
            <p className='product-list-title'> All Products List :</p>
            <div className='product-list-container'>

                {/* ----------- Table Header ---------- */}
                <div className='product-list-header'>
                    <b className='text-center'>Image</b>
                    <b className='text-center'>Name</b>
                    <b className='text-center'>Category</b>
                    <b className='text-center'>Sizes & Prices</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* ----------- Product List ---------- */}
                {Array.isArray(list) && list.map((item, index) => (
                    <div className='product-list-item' key={index}>
                        <img className='product-image' src={Array.isArray(item.image) ? item.image[0] : item.image || ''} alt={item.name} />
                        <p> {item.name} </p>
                        <p> {item.category} </p>

                        {/* ✅ Display Sizes & Prices or Single Price */}
                        <div className='size-price-container'>
                            {Array.isArray(item.sizes) && item.sizes.length > 0 ? (
                                item.sizes.map((sizeObj, i) => (
                                    <p key={i} className='size-price'>
                                        {sizeObj.size}: {currency} {sizeObj.price}
                                    </p>
                                ))
                            ) : (
                                <p className='single-price'> {currency} {item.price}</p>
                            )}
                        </div>

                        {/* Delete Button */}
                        <p onClick={() => removeProduct(item._id)} className='delete-button'> X </p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default List
