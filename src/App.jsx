import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navBar/Navbar';
import Footer from './components/footer/Footer';
import { CartProvider } from './context/CartContext';
import Home from './pages/inicio/Home';
import CardGames from './pages/juegoDeCartas/CardGames'; 
import Accesorios from './pages/accesorios/Accesorios';
import Singles from './pages/singles/Singles';
import Cart from './pages/carrito/Cart';
import Perfil from './pages/perfil/Perfil';
import AdminPanel from './pages/adminPanel/AdminPanel';
import ProductosPage from './pages/productos/ProductosPage';
import ProductDetailPage from './pages/producto/ProductDetailPage';
import NotFound from './pages/notFound/NotFound'; 

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
       
          <Route path="/" element={<Home />} />
          <Route path="/juegos-de-cartas" element={<CardGames />} />
          <Route path="/accesorios" element={<Accesorios />} />
          <Route path="/singles" element={<Singles />} />
          
         
          <Route path="/categoria-producto/:category" element={<ProductosPage />} />
          <Route path="/productos/:category" element={<ProductosPage />} />
          <Route path="/productos/juegos-de-cartas" element={<ProductosPage />} />
          <Route path="/productos/accesorios" element={<ProductosPage />} />
          <Route path="/productos/singles" element={<ProductosPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          
        
          <Route path="/cart" element={<Cart />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<AdminPanel />} />
          
         
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;