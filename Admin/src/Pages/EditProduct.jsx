import axios from "axios"
import React, { useEffect, useState } from "react"
import { backendURL } from "../App"
import { toast } from "react-toastify"
import { useParams, useNavigate } from "react-router-dom"

const EditProduct = ({ token }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [sizes, setSizes] = useState([])

    // 🔹 Fetch product by ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${backendURL}/api/product/single`,
                    { params: { productId: id } }
                )

                if (res.data.success) {
                    const p = res.data.product
                    setName(p.name)
                    setCategory(p.category)
                    setPrice(p.price || "")
                    setSizes(p.sizes || [])
                } else {
                    toast.error(res.data.message)
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to load product")
            } finally {
                setLoading(false) // ✅ THIS WAS MISSING
            }
        }

        fetchProduct()
    }, [id])



    // 🔹 Update product
    const updateProduct = async () => {
        try {
            const payload = {
                name,
                category,
                price,
                sizes
            }

            const res = await axios.put(
                `${backendURL}/api/product/update/${id}`,
                payload,
                { headers: { token } }
            )

            if (res.data.success) {
                toast.success("Product updated successfully")
                navigate("/list")
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error("Update failed")
        }
    }

    if (loading) {
        return <p className="loader-text">Loading product...</p>
    }

    return (
        <div className="edit-product-page">
            <h2>Edit Product:</h2>

            <div className="form-group">
                <label>Product Name:</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                />
            </div>

            <div className="form-group">
                <label>Category:</label>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                />
            </div>

            {sizes.length > 0 ? (
                sizes.map((s, i) => (
                    <div key={i} className="size-row">
                        <div className="form-group">
                            <label>Size:</label>
                            <input
                                value={s.size}
                                onChange={(e) => {
                                    const copy = [...sizes]
                                    copy[i].size = e.target.value
                                    setSizes(copy)
                                }}
                                placeholder="Enter size"
                            />
                        </div>

                        <div className="form-group">
                            <label>Price:</label>
                            <input
                                type="number"
                                value={s.price}
                                onChange={(e) => {
                                    const copy = [...sizes]
                                    copy[i].price = e.target.value
                                    setSizes(copy)
                                }}
                                placeholder="Enter price"
                            />
                        </div>
                    </div>
                ))
            ) : (
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                    />
                </div>
            )}

            <button className="update-btn" onClick={updateProduct}>Update Product</button>
        </div>

    )
}

export default EditProduct
