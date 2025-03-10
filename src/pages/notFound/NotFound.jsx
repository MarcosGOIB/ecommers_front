import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.css'; 

const NotFound = () => {
  return (
    <Container className="py-5 text-center not-found-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="not-found-content">
            <h1 className="display-1 fw-bold error-code">404</h1>
            <h2 className="mb-4">Página no encontrada</h2>
            <p className="lead mb-5">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;