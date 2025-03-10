import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Pagination, Alert, Badge } from 'react-bootstrap';
import ProductCard from '../../components/productCard/ProductCard';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import config from '../../config/config';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ProductosPage = () => {
 
  const { category } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const gameType = query.get('game_type');
  const location = useLocation();
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(category || 'juegos-de-cartas');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  

  const [gameTypes, setGameTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    gameType: gameType || '',
    brand: ''
  });
  

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9;
  
 
  const { addToCart } = useCart();

 
  useEffect(() => {
  
    if (location.pathname.includes('/productos/')) {
      const pathParts = location.pathname.split('/');
      const categoryFromPath = pathParts[pathParts.length - 1];
      setCurrentCategory(categoryFromPath);
    } 
    
    else if (category) {
      setCurrentCategory(category);
    }
  }, [location, category]);

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/products/categories`);
        setCategories(response.data.categories);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías. Por favor, intenta nuevamente más tarde.');
      }
    };

    fetchCategories();
  }, []);

  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory) return;
      
      setLoading(true);
      setError(null);
      
      try {
       
        const slug = currentCategory.toLowerCase().replace(/ /g, '-');
        
          let url = `${config.API_URL}/api/products`;
        if (slug) {
            url = `${config.API_URL}/api/products/category/${slug}`;
        }
        
      
        url += `?limit=${productsPerPage}&offset=${(currentPage - 1) * productsPerPage}`;
        
       
        if (selectedFilters.gameType) {
          url += `&game_type=${encodeURIComponent(selectedFilters.gameType)}`;
        }
        
        if (selectedFilters.brand) {
          url += `&brand=${encodeURIComponent(selectedFilters.brand)}`;
        }
        
        console.log("Fetching products from:", url);
        
        const response = await axios.get(url);
        
   
        const formattedProducts = response.data.products.map(product => ({
          ...product,
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity || 0)
        }));
        
        console.log("Products received:", formattedProducts);
        setProducts(formattedProducts);
        
        
        if (formattedProducts.length > 0) {
          const uniqueGameTypes = [...new Set(formattedProducts.map(p => p.game_type).filter(Boolean))];
          const uniqueBrands = [...new Set(formattedProducts.map(p => p.brand).filter(Boolean))];
          
          setGameTypes(uniqueGameTypes);
          setBrands(uniqueBrands);
        }
        
    
        const totalCount = response.data.total || formattedProducts.length;
        setTotalPages(Math.ceil(totalCount / productsPerPage));
        
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Por favor, intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentPage, selectedFilters]);

  useEffect(() => {
    if (gameType) {
      setSelectedFilters(prev => ({
        ...prev,
        gameType: gameType
      }));
    }
  }, [gameType]);

  
  const handleCategoryClick = (categorySlug) => {
    setCurrentCategory(categorySlug);
    setCurrentPage(1); 
    
    
    setSelectedFilters({
      gameType: '',
      brand: ''
    });
    
    
    navigate(`/categoria-producto/${categorySlug}`);
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setCurrentPage(1);
    

    if (type === 'gameType' && value) {
      navigate(`/categoria-producto/${currentCategory}?game_type=${encodeURIComponent(value)}`);
    } else if (type === 'gameType' && !value) {
      navigate(`/categoria-producto/${currentCategory}`);
    }
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

  
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="justify-content-center my-4">
        <Pagination.First 
          onClick={() => setCurrentPage(1)} 
          disabled={currentPage === 1}
        />
        <Pagination.Prev 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        />
        
       
        {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
        
          let pageNum;
          if (totalPages <= 5) {
            pageNum = idx + 1;
          } else if (currentPage <= 3) {
            pageNum = idx + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + idx;
          } else {
            pageNum = currentPage - 2 + idx;
          }
          
          return (
            <Pagination.Item
              key={pageNum}
              active={pageNum === currentPage}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Pagination.Item>
          );
        })}
        
        <Pagination.Next 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        />
        <Pagination.Last 
          onClick={() => setCurrentPage(totalPages)} 
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

 
  if (loading && products.length === 0) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Cargando productos...</h3>
        </div>
      </Container>
    );
  }

  
  const showGameTypeFilter = currentCategory === 'juegos-de-cartas' || currentCategory === 'singles';
  const showBrandFilter = currentCategory === 'accesorios';

  
  const formatCategoryTitle = () => {
    if (!currentCategory) return "Todos los Productos";
    
    
    return currentCategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  console.log("Current category:", currentCategory);
  console.log("Show game type filter:", showGameTypeFilter);
  console.log("Game types:", gameTypes);
  console.log("Selected filters:", selectedFilters);

  return (
    <Container className="mt-5">
      <Row>
       
        <Col md={3}>
          <div style={{ marginTop: '50px' }}>
            <h4>Categorías</h4>
            <ul className="list-unstyled mb-4">
              {categories.map((cat) => (
                <li key={cat.id} className="mb-2">
                  <Button
                    variant={cat.slug === currentCategory ? "primary" : "outline-primary"}
                    className="w-100 text-start"
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    {cat.name}
                  </Button>
                </li>
              ))}
            </ul>
            
           
            {showGameTypeFilter && gameTypes.length > 0 && (
              <div className="mb-4">
                <h4>Tipo de Juego</h4>
                <Form.Select
                  value={selectedFilters.gameType}
                  onChange={(e) => handleFilterChange('gameType', e.target.value)}
                  className="mb-3"
                >
                  <option value="">Todos los tipos</option>
                  {gameTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}
            
            {showBrandFilter && brands.length > 0 && (
              <div className="mb-4">
                <h4>Marca</h4>
                <Form.Select
                  value={selectedFilters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="mb-3"
                >
                  <option value="">Todas las marcas</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}
          </div>
        </Col>

        
        <Col md={9}>
          <h1 className="mb-4">{formatCategoryTitle()}</h1>
          
          {selectedFilters.gameType && (
            <div className="mb-3">
              <span className="me-2">Filtrado por:</span>
              <Badge bg="primary" className="me-2 p-2">
                {selectedFilters.gameType}{' '}
                <Button 
                  variant="link" 
                  className="p-0 text-white" 
                  onClick={() => handleFilterChange('gameType', '')}
                  style={{ textDecoration: 'none', fontSize: '1.2rem', lineHeight: 1, verticalAlign: 'middle' }}
                >
                  &times;
                </Button>
              </Badge>
            </div>
          )}
          
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          
          <Row>
            {products.length > 0 ? (
              products.map((product) => (
                <Col md={4} key={product.id} className="mb-4">
                  <ProductCard product={product} onClick={() => handleProductClick(product)} />
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <h3>No hay productos disponibles en esta categoría</h3>
                {selectedFilters.gameType && (
                  <Button 
                    variant="outline-primary" 
                    className="mt-3"
                    onClick={() => handleFilterChange('gameType', '')}
                  >
                    Quitar filtro: {selectedFilters.gameType}
                  </Button>
                )}
              </Col>
            )}
          </Row>
          
          
          {renderPagination()}
        </Col>
      </Row>

      
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedProduct.image_url || 'https://via.placeholder.com/300?text=Imagen+no+disponible'} 
                  alt={selectedProduct.name} 
                  className="img-fluid mb-3" 
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
                  }}
                />
              </Col>
              <Col md={6}>
                <h4 className="mb-3">{selectedProduct.name}</h4>
                <p className="mb-2">{selectedProduct.short_description}</p>
                
                {selectedProduct.game_type && (
                  <p className="mb-2"><strong>Tipo de juego:</strong> {selectedProduct.game_type}</p>
                )}
                
                {selectedProduct.brand && (
                  <p className="mb-2"><strong>Marca:</strong> {selectedProduct.brand}</p>
                )}
                
                <p className="mb-3 fs-4">Precio: ${selectedProduct.price.toFixed(2)}</p>
                <p className="mb-3">Stock disponible: {selectedProduct.quantity}</p>
                
                <Form.Group controlId="quantity" className="mb-3">
                  <Form.Label>Cantidad:</Form.Label>
                  <Form.Control
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={selectedProduct.quantity}
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    onClick={handleAddToCart}
                    disabled={selectedProduct.quantity < 1}
                  >
                    {selectedProduct.quantity < 1 ? 'Sin stock' : 'Agregar al carrito'}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
          
          {selectedProduct && (
            <div className="mt-4">
              <h5>Descripción detallada:</h5>
              <p>{selectedProduct.full_description}</p>
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
            disabled={selectedProduct?.quantity < 1}
          >
            Agregar al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductosPage;