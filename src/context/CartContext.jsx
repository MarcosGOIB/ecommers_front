import React, { createContext, useState, useEffect, useContext } from 'react';


export const CartContext = createContext();


export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useState([]);
  
  
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        setCartItems([]);
      }
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
          image: product.image_url || product.image,
          quantity: quantity
        }];
      }
    });
  };

  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  
  const clearCart = () => {
    setCartItems([]);
  };

  
  const getItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
    getItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};