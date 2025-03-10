import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Acceso.css';
import config from '../../config/config';

const Acceso = ({ showModal, handleCloseModal, handleLogin }) => {

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  
  const [activeTab, setActiveTab] = useState('login');

 
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    console.log("Intentando iniciar sesión con:", { email: loginEmail, password: loginPassword });
    
    try {
      const response = await axios.post(`${config.API_URL}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      
      console.log('Respuesta del servidor (login):', response.data);
      
      
      handleLogin(response.data.token, response.data.user);
      
      setMessage({
        text: 'Inicio de sesión exitoso',
        type: 'success'
      });
      
      
      setTimeout(() => {
        setLoginEmail('');
        setLoginPassword('');
        handleCloseModal();
      }, 1000);
      
    } catch (error) {
      console.error('Error en el login:', error);
      
      let errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      
      if (error.response) {
        console.log("Error detallado:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }
      
      setMessage({
        text: errorMessage,
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    if (registerPassword !== registerConfirmPassword) {
      setMessage({
        text: 'Las contraseñas no coinciden',
        type: 'danger'
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${config.API_URL}/api/auth/register`, {
        username: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      
      console.log('Respuesta del servidor (registro):', response.data);
      
   
      handleLogin(response.data.token, response.data.user);
      
      setMessage({
        text: 'Registro exitoso',
        type: 'success'
      });
      
   
      setTimeout(() => {
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        handleCloseModal();
      }, 1000);
      
    } catch (error) {
      console.error('Error en el registro:', error);
      
      let errorMessage = 'Error al registrarse. Por favor, inténtalo de nuevo.';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      setMessage({
        text: errorMessage,
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const fillAdminCredentials = () => {
    setLoginEmail('admin@example.com');
    setLoginPassword('admin123');
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} size="lg" className="acceso-modal">
      <Modal.Header closeButton>
        <Modal.Title>Acceder / Registrarse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
            {message.text}
          </Alert>
        )}
        
      
        <div className="tabs-container">
          <button 
            type="button"
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => setActiveTab('login')}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button"
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registrarse
          </button>
        </div>
        

       
        {activeTab === 'login' && (
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="loginPassword" className="mt-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mt-2" controlId="showPasswordCheck">
              <Form.Check
                type="checkbox"
                label="Mostrar contraseña"
                onChange={() => setShowPassword(!showPassword)}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              className="mt-3 w-100" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              className="mt-2 w-100" 
              onClick={fillAdminCredentials}
            >
              Usar credenciales de administrador
            </Button>
            
            <div className="mobile-form-nav">
              <span>¿No tienes cuenta?</span>
              <span className="mobile-nav-divider"></span>
              <button 
                type="button"
                className="mobile-form-link"
                onClick={() => setActiveTab('register')}
              >
                Registrarse
              </button>
            </div>
          </Form>
        )}
        
       
        {activeTab === 'register' && (
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group controlId="registerName">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Crea un nombre de usuario"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="registerEmail" className="mt-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="registerPassword" className="mt-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Crea una contraseña"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="registerConfirmPassword" className="mt-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Confirma tu contraseña"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mt-2" controlId="showPasswordCheckRegister">
              <Form.Check
                type="checkbox"
                label="Mostrar contraseña"
                onChange={() => setShowPassword(!showPassword)}
              />
            </Form.Group>
            
            <Button 
              variant="success" 
              className="mt-3 w-100" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Registrarse'}
            </Button>
            
            <div className="mobile-form-nav">
              <span>¿Ya tienes cuenta?</span>
              <span className="mobile-nav-divider"></span>
              <button 
                type="button"
                className="mobile-form-link"
                onClick={() => setActiveTab('login')}
              >
                Iniciar Sesión
              </button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Acceso;