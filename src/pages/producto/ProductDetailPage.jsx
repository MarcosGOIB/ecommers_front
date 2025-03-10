import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CategoryFilter from '../../components/seccionProductos/CategoriesSection';

const ProductDetailPage = () => {
  const { id } = useParams();
  const products = [
    { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', price: 30, image: 'https://sm.ign.com/t/ign_es/lists/e/every-poke/every-pokemon-game-on-the-nintendo-switch-in-2024_rkq1.1280.jpg' },
    { id: 2, name: 'Producto 2', description: 'Descripción del producto 2', price: 35, image: 'https://sm.ign.com/t/ign_es/lists/e/every-poke/every-pokemon-game-on-the-nintendo-switch-in-2024_rkq1.1280.jpg' },
  ];
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        
        <Col md={3}>
          <CategoryFilter />
        </Col>

      
        <Col md={9}>
          <h1>{product.name}</h1>
          <Row>
            <Col md={6}>
              <img src={product.image} alt={product.name} className="img-fluid" />
            </Col>
            <Col md={6}>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <Button variant="primary">Comprar</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;