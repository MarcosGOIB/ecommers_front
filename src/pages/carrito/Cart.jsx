import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CartItem from '../../components/itemCarrito/CartItem';
import CartTotal from '../../components/totalCompraCarrito/CartTotal';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const subtotal = getCartTotal();

  return (
    <Container className="mt-4">
      <h1>Carrito de Compras</h1>
      <Row>
        <Col md={8}>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdateQuantity={updateQuantity} 
                onRemove={removeFromCart} 
              />
            ))
          ) : (
            <Alert variant="info">
              El carrito está vacío. <Link to="/">Explora nuestra tienda</Link> para agregar productos.
            </Alert>
          )}
          <Link to="/">
            <Button variant="outline-dark" className="mt-3">← Seguir Comprando</Button>
          </Link>
        </Col>
        <Col md={4}>
          <CartTotal subtotal={subtotal} />
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;