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
                // ✅ FIX IS HERE
                setList(Array.isArray(response.data.data) ? response.data.data : [])
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
            const response = await axios.post(
                backendURL + '/api/product/remove',
                { id },
                { headers: { token } }
            )

            if (response.data.success) {
                toast.success(response.data.message)
                fetchList() // refresh list
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
            <p className='product-list-title'>All Products List :</p>

            <div className='product-list-container'>
                {/* Header */}
                <div className='product-list-header'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Sizes & Prices</b>
                    <b>Action</b>
                </div>

                {/* Products */}
                {list.length === 0 && <p>No products found</p>}

                {list.map((item) => (
                    <div className='product-list-item' key={item._id}>
                        <img
                            className='product-image'
                            src={Array.isArray(item.image) ? item.image[0] : item.image}
                            alt={item.name}
                            onError={(e) => (e.target.src = '/placeholder.jpg')}
                        />

                        <p>{item.name}</p>
                        <p>{item.category}</p>

                        {/* Sizes & Prices */}
                        <div className='size-price-container'>
                            {item.sizes?.length > 0 ? (
                                item.sizes.map((s, i) => (
                                    <p key={i}>
                                        {s.size}: {currency} {s.price}
                                    </p>
                                ))
                            ) : (
                                <p>{currency} {item.price}</p>
                            )}
                        </div>

                        <p
                            className='delete-button'
                            onClick={() => removeProduct(item._id)}
                        >
                            X
                        </p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default List
