import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductosPage from '../pages/productos/ProductosPage';
import ProductDetailPage from '../pages/productos/ProductDetailPage';
import AdminPanel from '../pages/adminPanel/AdminPanel';
import Perfil from '../pages/Perfil';
import Cart from '../pages/Cart';
import CardGames from '../pages/CardGames';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
     
      <Route path="/" element={<Home />} />
      
    
      <Route path="/categoria-producto/juegos-de-cartas" element={<CardGames />} />
      <Route path="/categoria-producto/:category" element={<ProductosPage />} />
      
    
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      
    
      <Route path="/admin" element={<AdminPanel />} />
      
    
      <Route path="/perfil" element={<Perfil />} />
      
     
      <Route path="/cart" element={<Cart />} />
      
     
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;