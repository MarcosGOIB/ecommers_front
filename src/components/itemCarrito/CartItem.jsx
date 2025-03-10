import React from 'react';
import { Button, Form, Image } from 'react-bootstrap';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(item.id, value);
    }
  };

  return (
    <div className="d-flex align-items-center border-bottom py-3">
      <Image 
        src={item.image} 
        alt={item.name} 
        width="80" 
        height="80" 
        className="me-3" 
        style={{ objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/80?text=Producto';
        }}
      />
      <div className="flex-grow-1">
        <h6>{item.name}</h6>
        <p className="mb-1 fw-bold">${typeof item.price === 'number' ? item.price.toLocaleString() : parseFloat(item.price).toLocaleString()}</p>
        <div className="d-flex align-items-center">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <Form.Control 
            type="number"
            min="1"
            value={item.quantity} 
            onChange={handleQuantityChange}
            className="mx-2 text-center" 
            style={{ width: "60px" }} 
          />
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <div className="ms-3 text-end">
        <p className="mb-1">${((typeof item.price === 'number' ? item.price : parseFloat(item.price)) * item.quantity).toLocaleString()}</p>
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={() => onRemove(item.id)}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
