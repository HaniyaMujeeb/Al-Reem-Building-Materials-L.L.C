import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendURL, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {
    const [list, setList] = useState([])
    const [search, setSearch] = useState("") // ✅ search state
    const navigate = useNavigate()

    // Fetch Product List from Backend
    const fetchList = async () => {
        try {
            const response = await axios.get(backendURL + '/api/product/list')

            if (response.data.success) {
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

    // Filtered products based on search
    const filteredList = list.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <p className='product-list-title'>All Products List :</p>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px"
                }}
            />

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
                {filteredList.length === 0 && <p>No products found</p>}

                {filteredList.map((item) => (
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
                                        {s.size} {/* : {currency} {s.price} */}
                                    </p>
                                ))
                            ) : (
                                <p>{currency} {item.price}</p>
                            )}
                        </div>

                        {/* Product Edit & Delete Buttons */}
                        <div className="action-buttons">
                            <button className="edit-button" onClick={() => navigate(`/edit-product/${item._id}`)}>
                                Edit
                            </button>
                            <button className="delete-button" onClick={() => removeProduct(item._id)}>
                                X
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}

export default List
