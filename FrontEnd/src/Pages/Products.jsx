import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Component/Title';
import ProductItem from '../Component/ProductItem';

const Products = () => {
  const { products = [], search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');


  // Toggle Category Selection
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
  };

  // Toggle Sub-Category Selection
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
  };

  // Filter products based on search, category, subcategory
  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(filtered);
  };

  // Get numeric price based on selected size
  const getNumericPrice = (item) => {
    if (item.sizes?.length > 0) {
      const selected = selectedSizes[item._id] || item.sizes[0].size;
      const sizeObj = item.sizes.find(s => s.size === selected);
      if (sizeObj?.price) return sizeObj.price;
    }

    if (typeof item.price === 'number') return item.price;

    return Infinity;
  };

  // Sort products
  const sortProducts = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
        break;
      case 'high-low':
        sorted.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
        break;
      default:
        applyFilter();
        return;
    }

    setFilterProducts(sorted);
  };

  // Update selected size
  const handleSizeChange = (productId, newSize) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: newSize }));
  };

  // Apply filter whenever products, search, or category/subCategory changes
  useEffect(() => {

    if (products?.length > 0) applyFilter();

  }, [products, search, showSearch, category, subCategory]);

  // Apply sorting whenever sortType changes
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="product-container">

      {/* Filter Sidebar */}
      <div className={`filter-container ${showFilter ? "open" : ""}`}>

        <p className="filter-title">
          FILTER PRODUCTS :
        </p>

        <div className="filter-options show">
          <p className="filter-section">CATEGORIES :</p>
          <div className="filter-list">
            {["MDF", "Plywood", "Aluminium Hardware", "Flooring", "Hardware"].map(cat => (
              <label key={cat} className="filter-option">
                <input type="checkbox" value={cat} onChange={toggleCategory} />
                {cat}
              </label>
            ))}
          </div>

          <p className="filter-subsection">TYPE:</p>
          <div className="filter-sublist">
            {[
              "MDF Sheets", "PVC Panel", "Melamine MDF Sheets", "Door Handles", "Door Accessories",
              "Hinges", "Plywood Sheets", "Commercial Plywood", "PVC High Glossy MDF Panel",
              "PVC Soft Touch MDF Panel", "Chevron Flooring", "Wooden Floor Tile", "Door Locks",
              "Door Closer", "Glass Door Accessories", "Silicone & Adhesives", "Other Hardware Accessories"
            ].map(subCat => (
              <label key={subCat} className="filter-suboption">
                <input type="checkbox" value={subCat} onChange={toggleSubCategory} />
                {subCat}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ OVERLAY — MUST BE HERE */}
      {showFilter && (
        <div
          className="filter-overlay"
          onClick={() => setShowFilter(false)}
        />
      )}

      {/* Product List */}
      <div className="content-container">

        <div className="sort-header-container">
          {/* Sort Title */}
          <div className="sort-title-container">
            <Title text1="ALL" text2="PRODUCTS :" />
          </div>

          {/* Row for Filter Button + Sort Dropdown */}
          <div className="sort-buttons-row">
            <button
              className="mobile-filter-btn"
              onClick={() => setShowFilter(true)}
            >
              ☰ Filter
            </button>

            <select onChange={e => setSortType(e.target.value)} className="sort-dropdown">
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>


        <div className="all-products-grid">
          {filterProducts.map(item => (
            <div key={item._id} className="all-products">
              <ProductItem
                id={item._id}
                image={Array.isArray(item.image) ? item.image[0] : item.image}
                name={item.name}
                price={
                  item.sizes?.length
                    ? item.sizes[0].price
                    : item.price
                }
              />
            </div>
          ))}
        </div>

      </div>
    </div>

  );
};

export default Products;
