import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Nav, Container, Badge } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Acceso from "../../pages/acceso/Acceso.jsx";
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './Navbar.css'; 
import config from '../../config/config.js';

const NavbarComponent = () => {

  
  const [showModal, setShowModal] = useState(false);

  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  

 
  const { getCartTotal, getItemsCount } = useCart();
  const cartTotal = getCartTotal();
  const itemsCount = getItemsCount();


 
  const handleShowModal = () => setShowModal(true);


 
  const handleCloseModal = () => setShowModal(false);


  
  const checkAuthStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUserData(null);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${config.API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsAuthenticated(true);
      setUserData(response.data.user);
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };


 
  const handleLogin = async (token, user) => {
    localStorage.setItem('token', token);
    await checkAuthStatus(); 
    handleCloseModal();
  };


  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/'); 
  };

  
  useEffect(() => {
    checkAuthStatus();
    
   
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 300000); 
    
    return () => clearInterval(interval);
  }, []);

 
  const isAdmin = userData && userData.role === 'admin';

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src="/logo.png" 
            alt="TwistedFate Logo" 
            className="navbar-logo"
          />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>TwistedFate</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/juegos-de-cartas">
              Juegos de Cartas
            </Nav.Link>
            <Nav.Link as={Link} to="/accesorios">
              Accesorios
            </Nav.Link>
            <Nav.Link as={Link} to="/singles">
              Singles
            </Nav.Link>
          </Nav>
          
          <Nav>
            {loading ? (
              <Nav.Link disabled>Cargando...</Nav.Link>
            ) : isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/perfil">
                  {userData?.username || 'Perfil'}
                </Nav.Link>
                
                
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                )}
                
                <Button 
                  variant="link" 
                  className="nav-link" 
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button 
                variant="link" 
                className="nav-link" 
                onClick={handleShowModal}
              >
                Acceder
              </Button>
            )}
            
            <Nav.Link as={Link} to="/cart" className="position-relative">
              Carrito {' '}
              {itemsCount > 0 && (
                <Badge bg="warning" text="dark" pill>
                  {itemsCount}
                </Badge>
              )} / ${cartTotal.toLocaleString()}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

     
      <Acceso 
        showModal={showModal} 
        handleCloseModal={handleCloseModal} 
        handleLogin={handleLogin} 
      />
    </Navbar>
  );
};

export default NavbarComponent;
