import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import '../style.css'; 
import "../mobile.css";
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('products')) {
            setVisible(true);
            
        }
        else {
            setVisible(false);
        }
    }, [location])

    return showSearch && visible ? (
        <div className = "search-bar">
            <div className = "search-input-container">

                <input 
                    value = {search} 
                    onChange = { (e) => setSearch(e.target.value)} 
                    className = "search-input" 
                    type = "text" 
                    placeholder = "Search Products" 
                />

                <img className = "search-icon" src = {assets.search_icon} alt = "" />
            </div>

            <img 
                onClick = {() => setShowSearch(false)} 
                className = "cross-icon" 
                src = {assets.cross_icon} 
                alt = "" 
            />
        </div>
    ) : null;
};

export default SearchBar;

