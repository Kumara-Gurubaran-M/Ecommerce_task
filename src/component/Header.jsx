import React, { useState, useEffect } from 'react';
import Cart from "../image/grocery-store.png";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Header = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { name: 'English' },
    {  name: 'French' },
    {  name: 'Spanish' },
  ];
  
  useEffect(() => {
    fetchCategories();
    AOS.init();
  }, []);
  

  useEffect(() => {
    if (!searchTerm && category === "All Categories") {
      fetchAllProducts();
    } else if (!searchTerm) {
      fetchProductsByCategory();
    } else {
      setProducts(prevProducts =>
        prevProducts.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [category, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      fetchProductsByCategoryAndSearch();
    }
  }, [category, searchTerm]);

  const fetchAllProducts = () => {
    return fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(products => {
        setProducts(products);
        return products; 
      })
      .catch(error => {
        console.error('Error fetching all products:', error);
        throw error;
      });
  };
  

  
  
  
  const fetchCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(categories => setCategories(categories))
      .catch(error => console.error('Error fetching categories:', error));
  };

  const fetchProductsByCategory = () => {
    if (category) {
      fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(products => setProducts(products))
        .catch(error => console.error('Error fetching products by category:', error));
    } else {
      fetchAllProducts();
    }
  };
  
  const fetchProductsByCategoryAndSearch = () => {
    if (category === "All Categories" && searchTerm) {
      fetchAllProducts()
        .then(products => {
          const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProducts(filteredProducts);
        })
        .catch(error => console.error('Error fetching products:', error));
    } else if (category) {
      fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(products => {
          const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProducts(filteredProducts);
        })
        .catch(error => console.error('Error fetching products by category:', error));
    }
  };
  

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    if (selectedCategory === "All Categories") {
      //setSearchTerm('');
      fetchAllProducts();
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    
  };

  return (
    <>
      <header className='header'>
        <div className='header-content'>
          <h1 className='logo'>Eflyer</h1>
          <div className='header-main'>
            <select className='select' value={category} onChange={handleCategoryChange}>
              <option value="All Categories">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>
          
          <div>
      <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>

          <div className='cart'>
            <img src={Cart} alt='cart'/>
            <p>Cart</p>
          </div>
        </div>
        <h1 className='header-title' data-aos="fade-up" data-aos-duration="2000">GET START YOUR FAVOURITE SHOPPING</h1>
      </header>

      <div className='whole-product'>
        <h1 className='title'>Mens & Womens Fashion </h1>
        <div className='product-container'>
          {products.length > 0 ? (
            products.map(product => (
              <section key={product.id} className='product-section' data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="3000">
                <h3 className='product-title'>{product.title}</h3>
                <p className='product-price'><span>price: </span>${product.price}</p>
                <img src={product.image} alt={product.title} />
                <p className='product-description'>{product.description}</p>
              </section>
            ))
          ) : (
            <>
              <p className='no-product-p'></p>
              <h4 className='no-product'>No Products Found</h4>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
