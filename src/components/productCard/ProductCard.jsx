import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import './ProductCard.css';
import config from '../../config/config';

const ProductCard = ({ product, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const defaultImage = '/ruta-a-imagen-por-defecto.jpg'; 
  
  const price = typeof product.price === 'number' 
    ? product.price.toFixed(2) 
    : parseFloat(product.price).toFixed(2);

  const getImageUrl = () => {
    if (!product.image_url || imageError) {
      return defaultImage;
    }

    if (product.image_url.startsWith('http')) {
      return product.image_url;
    }

    if (product.image_url.startsWith('/')) {
  
      return `${config.API_URL}${product.image_url}`;
    }

    return `${config.API_URL}/uploads/${product.image_url}`;
  };

  return (
    <Card className="product-card h-100">
      <div className="product-image-container">
        <Card.Img 
          variant="top" 
          src={getImageUrl()}
          alt={product.name} 
          className="product-image"
          onError={() => setImageError(true)}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="product-title">{product.name}</Card.Title>
        <Card.Text className="product-description">
          {product.short_description}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="product-price">${price}</span>
            <span className={`stock-status ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.quantity > 0 ? 'En Stock' : 'Agotado'}
            </span>
          </div>
          <Button 
            variant="primary" 
            onClick={() => onClick(product)} 
            className="w-100"
            disabled={product.quantity < 1}
          >
            {product.quantity < 1 ? 'Sin stock' : 'Ver detalles'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;