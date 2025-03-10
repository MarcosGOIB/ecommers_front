
import React, { createContext, useState, useEffect } from 'react';

export const MyContext = createContext();


export const ContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.ejemplo.com/productos'); 
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  
  useEffect(() => {
    fetchProducts();
  }, []);

  
  const contextValue = {
    products,
    fetchProducts, 
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};