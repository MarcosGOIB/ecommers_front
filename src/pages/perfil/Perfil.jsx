import React, { useState } from 'react';
import { Tabs, Tab, Form, Button, Table } from 'react-bootstrap';

const Perfil = () => {
  
  const [userData, setUserData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    direccion: 'Calle Falsa 123',
    telefono: '123-456-7890',
  });

  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  
  const [purchaseHistory, setPurchaseHistory] = useState([
    { id: 1, fecha: '2023-10-01', total: 50.0, productos: ['Producto A', 'Producto B'] },
    { id: 2, fecha: '2023-10-05', total: 75.0, productos: ['Producto C'] },
  ]);

  const handleGeneralDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const saveGeneralData = () => {
    alert('Datos generales guardados correctamente');
   
  };

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña cambiada correctamente');
    
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Perfil de Usuario</h1>
      <Tabs defaultActiveKey="datosGenerales" id="profile-tabs">
      
        <Tab eventKey="datosGenerales" title="Datos Generales">
          <Form className="mt-4">
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={userData.nombre}
                onChange={handleGeneralDataChange}
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleGeneralDataChange}
              />
            </Form.Group>
            <Form.Group controlId="direccion" className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={userData.direccion}
                onChange={handleGeneralDataChange}
              />
            </Form.Group>
            <Form.Group controlId="telefono" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={userData.telefono}
                onChange={handleGeneralDataChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={saveGeneralData}>
              Guardar Cambios
            </Button>
          </Form>
        </Tab>

       
        <Tab eventKey="cambioContraseña" title="Cambio de Contraseña">
          <Form className="mt-4">
            <Form.Group controlId="currentPassword" className="mb-3">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={changePassword}>
              Cambiar Contraseña
            </Button>
          </Form>
        </Tab>

       
        <Tab eventKey="historialCompras" title="Historial de Compras">
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.id}</td>
                  <td>{purchase.fecha}</td>
                  <td>${purchase.total.toFixed(2)}</td>
                  <td>{purchase.productos.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Perfil;