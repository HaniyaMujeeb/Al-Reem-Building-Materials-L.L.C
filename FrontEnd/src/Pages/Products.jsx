import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Component/Title';
import ProductItem from '../Component/ProductItem';

const Products = () => {
  const { products = [], search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // Toggle Category Selection
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Toggle Sub-Category Selection
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Apply Filtering Based on Selected Options
  const applyFilter = () => {
    let filteredProducts = [...products];

    if (showSearch && search) {
      filteredProducts = filteredProducts.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filteredProducts = filteredProducts.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filteredProducts = filteredProducts.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(filteredProducts);
  };


  const getNumericPrice = (item) => {
    // Try to get price from sizes
    if (Array.isArray(item.sizes) && item.sizes.length > 0) {
      const selectedSize = selectedSizes[item._id] || item.sizes[0].size;
      const sizeObj = item.sizes.find((s) => s.size === selectedSize);
      if (sizeObj && typeof sizeObj.price === 'number') {
        return sizeObj.price;
      }
    }

    if (typeof item.price === 'number') {
      return item.price;
    }

    return Infinity;
  };


  // Apply Sorting on Products
  const sortProduct = () => {
    let sortedProducts = [...filterProducts];
  
    switch (sortType) {
      case 'low-high':
        sortedProducts.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
        break;
      case 'high-low':
        sortedProducts.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
        break;
      default:
        applyFilter();
        return;
    }
  
    setFilterProducts([...sortedProducts]);
  };
  
  

  // Handle Size Selection
  const handleSizeChange = (productId, newSize) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: newSize
    }));
  };


  // Update Filtered Products on Changes
  useEffect(() => {
    if (products.length > 0) {
      applyFilter();
    }
  }, [category, subCategory, search, showSearch, products]);


  // Update Sorting when Sort Type Changes
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="product-container">
      {/* Filter Sidebar */}
      <div className="filter-container">
        <p className="filter-title" onClick={() => setShowFilter(!showFilter)}>
          FILTER PRODUCTS :
        </p>

        {/* Category Filter */}
        <div className={`filter-options ${showFilter ? 'show' : 'hide'}`}>
          <p className="filter-section">CATEGORIES :</p>

          <div className="filter-list">
            {["MDF", "Plywood", "Aluminium Hardware", "Flooring", "Hardware"].map((cat) => (
              <label key={cat} className="filter-option">
                <input className="filter-checkbox" type="checkbox" value={cat} onChange={toggleCategory} />
                {cat}
              </label>
            ))}
          </div>

          {/* Sub-Category Filter */}
          <div className={`filter-suboptions ${showFilter ? 'show' : 'hide'}`}>
            <p className="filter-subsection">TYPE:</p>

            <div className="filter-sublist">
              {[
                "MDF Sheets", "PVC Panel", "Melamine MDF Sheets", "Door Handles", "Door Accessories",
                "Hinges", "Plywood Sheets", "Commercial Plywood", "PVC High Glossy MDF Panel",
                "PVC Soft Touch MDF Panel", "Chevron Flooring", "Wooden Floor Tile", "Door Locks",
                "Door Closer", "Glass Door Accessories", "Silicone & Adhesives", "Other Hardware Accessories"
              ].map((subCat) => (
                <label key={subCat} className="filter-suboption">
                  <input className="filter-checkbox" type="checkbox" value={subCat} onChange={toggleSubCategory} />
                  {subCat}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="content-container">
        {/* Title & Sort Container */}
        <div className="sort-header-container">
          <div className="sort-title-container">
            <Title text1="ALL" text2="PRODUCTS :" />
          </div>

          {/* Sort Dropdown */}
          <div className="sort-container">
            <select onChange={(e) => setSortType(e.target.value)} className="sort-dropdown">
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="all-products-grid-container">
          <div className="all-products-grid">

            {filterProducts.map((item) => {
              // Get the default size (if available)
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
                <div key={item._id} className="all-products">
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
    </div>
  );
};

export default Products;

