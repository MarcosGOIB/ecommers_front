import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Modal, Button, Alert, Collapse } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './ProductPages.css';
import PaginationComponent from '../../components/pagination/PaginationComponent';
import config from '../../config/config';

const Accesorios = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessories, setAccessories] = useState([]);
  const [brands, setBrands] = useState([]);
 
  const [priceRange, setPriceRange] = useState([0, 100]);
 
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
 
  const [selectedProduct, setSelectedProduct] = useState(null);
 
  const [quantity, setQuantity] = useState(1);
  
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);


  const [showFilters, setShowFilters] = useState(false);
  
  
  const { addToCart } = useCart();

  
  const formatPriceCLP = (price) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  
  useEffect(() => {
    const fetchAccessories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.API_URL}/api/products/category/accesorios`);
        
        
        const formattedProducts = response.data.products.map(product => ({
          ...product,
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity || 0)
        }));
        
        setAccessories(formattedProducts);
        
        
        const uniqueBrands = [...new Set(formattedProducts.map(product => product.brand).filter(Boolean))];
        setBrands(uniqueBrands);
        
        
        if (formattedProducts.length > 0) {
          const maxPrice = Math.max(...formattedProducts.map(product => product.price));
          setPriceRange([0, maxPrice]);
        }
      } catch (err) {
        console.error('Error al cargar accesorios:', err);
        setError('No se pudieron cargar los accesorios. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand)); 
    } else {
      setSelectedBrands([...selectedBrands, brand]); 
    }
 
    setCurrentPage(1);
  };

 
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setQuantity(1); 
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

 
  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
 
    alert(`${selectedProduct.name} agregado al carrito`);
    handleCloseModal();
  };

 
  const filteredAccessories = accessories.filter(accessory => {
    const isInPriceRange = accessory.price >= priceRange[0] && accessory.price <= priceRange[1];
    const isBrandSelected = selectedBrands.length === 0 || selectedBrands.includes(accessory.brand);
    return isInPriceRange && isBrandSelected;
  });

 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccessories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
   
    window.scrollTo({
      top: document.querySelector('.section-title').offsetTop - 100,
      behavior: 'smooth'
    });
  };

 
  if (loading && accessories.length === 0) {
    return (
      <Container className="products-container">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando accesorios...</span>
          </div>
          <h3 className="mt-3">Cargando accesorios...</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container className="products-container">
      <Row>
       
        <div className="d-lg-none mb-3 w-100">
          <Button 
            variant="primary"
            onClick={() => setShowFilters(!showFilters)}
            className="w-100 d-flex justify-content-between align-items-center"
            aria-expanded={showFilters}
          >
            <span>Filtros</span>
            <i className={`fa fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
          </Button>
          
          <Collapse in={showFilters}>
            <div className="mt-3">
              <div className="filter-panel">
                <h4>Filtrar por:</h4>

               
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Rango de Precio</Card.Title>
                    <Form.Label className="price-range-label">
                      {formatPriceCLP(priceRange[0])} - {formatPriceCLP(priceRange[1])}
                    </Form.Label>
                    <Form.Range
                      min={0}
                      max={accessories.length > 0 ? Math.max(...accessories.map(a => a.price)) : 100}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value, 10)])}
                    />
                  </Card.Body>
                </Card>

              
                <Card>
                  <Card.Body>
                    <Card.Title>Marca</Card.Title>
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <Form.Check
                          key={brand}
                          type="checkbox"
                          id={`brand-mobile-${brand}`}
                          label={brand}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                      ))
                    ) : (
                      <p>No hay marcas disponibles</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Collapse>
        </div>

     
        <Col lg={3} className="d-none d-lg-block">
          <div className="filter-panel">
            <h4>Filtrar por:</h4>

            
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Rango de Precio</Card.Title>
                <Form.Label className="price-range-label">
                  {formatPriceCLP(priceRange[0])} - {formatPriceCLP(priceRange[1])}
                </Form.Label>
                <Form.Range
                  min={0}
                  max={accessories.length > 0 ? Math.max(...accessories.map(a => a.price)) : 100}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value, 10)])}
                />
              </Card.Body>
            </Card>

          
            <Card>
              <Card.Body>
                <Card.Title>Marca</Card.Title>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <Form.Check
                      key={brand}
                      type="checkbox"
                      id={`brand-${brand}`}
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                  ))
                ) : (
                  <p>No hay marcas disponibles</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>

        
        <Col lg={9}>
          <h1 className="section-title">Accesorios</h1>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {filteredAccessories.length > 0 ? (
            <>
              <Row className="g-3">
                {currentItems.map(accessory => (
                  <Col md={6} lg={4} key={accessory.id}>
                    <Card className="product-card" onClick={() => handleProductClick(accessory)}>
                      <div className="product-img-container">
                        <Card.Img
                          className="product-img"
                          src={accessory.image_url || 'https://via.placeholder.com/300?text=Imagen+no+disponible'}
                          alt={accessory.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
                          }}
                        />
                      </div>
                      <Card.Body className="product-card-body">
                        <h5 className="product-title">{accessory.name}</h5>
                        <p className="product-description">
                          {accessory.short_description || `${accessory.brand || 'Accesorio'} - ${accessory.name}`}
                        </p>
                        <div className="product-card-footer">
                          <div>
                            <span className="product-price">{formatPriceCLP(accessory.price)}</span>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="buy-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(accessory);
                            }}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              
              <PaginationComponent 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <Alert variant="info">
              No se encontraron productos que coincidan con los filtros seleccionados.
            </Alert>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" className="product-modal">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <div className="product-modal-img-container">
                  <img 
                    src={selectedProduct.image_url || 'https://via.placeholder.com/300?text=Imagen+no+disponible'} 
                    alt={selectedProduct.name} 
                    className="product-modal-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="product-detail-title">{selectedProduct.name}</h4>
                <p className="product-detail-description">{selectedProduct.short_description}</p>
                {selectedProduct.brand && (
                  <p className="product-detail-meta"><strong>Marca:</strong> {selectedProduct.brand}</p>
                )}
                <div className="product-detail-price">
                  {formatPriceCLP(selectedProduct.price)}
                </div>
                <p className={`stock-info ${selectedProduct.quantity > 0 ? 'stock-available' : 'stock-unavailable'}`}>
                  {selectedProduct.quantity > 0 
                    ? `Stock disponible: ${selectedProduct.quantity} unidades` 
                    : 'Producto sin stock disponible'}
                </p>
                
                {selectedProduct.quantity > 0 && (
                  <Form.Group controlId="quantity" className="mb-3">
                    <Form.Label>Cantidad:</Form.Label>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={selectedProduct.quantity || 1}
                    />
                  </Form.Group>
                )}
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    onClick={handleAddToCart}
                    disabled={!selectedProduct.quantity || selectedProduct.quantity < 1}
                    className="mt-2"
                  >
                    {!selectedProduct.quantity || selectedProduct.quantity < 1 ? 'Sin stock' : 'Agregar al carrito'}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
          
          {selectedProduct && selectedProduct.full_description && (
            <div className="mt-4">
              <h5 className="mb-3">Descripción detallada:</h5>
              <p className="product-detail-description">{selectedProduct.full_description}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddToCart}
            disabled={!selectedProduct?.quantity || selectedProduct?.quantity < 1}
          >
            Agregar al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Accesorios;