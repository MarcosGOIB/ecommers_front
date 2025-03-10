import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const CartTotal = ({ subtotal }) => {
  const [shipping, setShipping] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { clearCart } = useCart();

  const handleShippingChange = (event) => {
    setShipping(parseInt(event.target.value, 10));
  };

  const handleCheckout = () => {
   
    setShowSuccessMessage(true);
    
    
    setTimeout(() => {
      clearCart();
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <Card className="p-3">
      <h5>Total del Carrito</h5>
      
      {showSuccessMessage && (
        <Alert variant="success" className="my-2">
          ¡Compra realizada con éxito! Redirigiendo...
        </Alert>
      )}
      
      <p>Subtotal: <strong>${subtotal.toLocaleString()}</strong></p>
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Opciones de envío:</Form.Label>
          <Form.Check 
            type="radio" 
            id="shipping-starken"
            label="Starken por pagar" 
            value="0" 
            checked={shipping === 0} 
            onChange={handleShippingChange} 
            name="shippingOption"
          />
          <Form.Check 
            type="radio" 
            id="shipping-tobalaba"
            label="Retiro en sucursal Tobalaba" 
            value="0" 
            checked={shipping === 0} 
            onChange={handleShippingChange} 
            name="shippingOption"
          />
          <Form.Check 
            type="radio" 
            id="shipping-varas"
            label="Retiro en sucursal Antonio Varas" 
            value="0" 
            checked={shipping === 0} 
            onChange={handleShippingChange} 
            name="shippingOption"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cupón de descuento:</Form.Label>
          <div className="d-flex">
            <Form.Control 
              type="text" 
              placeholder="Código de cupón" 
              className="me-2"
            />
            <Button variant="outline-secondary">Aplicar</Button>
          </div>
        </Form.Group>
      </Form>

      <hr />
      <p className="d-flex justify-content-between">
        <span>Subtotal:</span>
        <span>${subtotal.toLocaleString()}</span>
      </p>
      <p className="d-flex justify-content-between">
        <span>Envío:</span>
        <span>${shipping.toLocaleString()}</span>
      </p>
      <p className="d-flex justify-content-between fw-bold">
        <span>Total:</span>
        <span>${(subtotal + shipping).toLocaleString()}</span>
      </p>

      <Button 
        variant="warning" 
        className="w-100 mt-3" 
        disabled={subtotal === 0 || showSuccessMessage}
        onClick={handleCheckout}
      >
        Finalizar Compra
      </Button>
    </Card>
  );
};

export default CartTotal;