import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Carousel, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsSection.css';
import config from '../../config/config';

const NewsSection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función para dividir el array en grupos
  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setLoading(true);
      try {
        // Cambio clave: usar la ruta correcta para obtener los productos
        // En lugar de usar /latest, usamos la ruta normal pero con un límite y ordenamos por ID descendente
        const response = await axios.get(`${config.API_URL}/api/products?limit=6`);
        console.log('Respuesta de productos:', response.data);
        
        // Verificamos si existe response.data.products antes de hacer map
        if (response.data && Array.isArray(response.data.products)) {
          // Ordenamos los productos por ID descendente (asumiendo que IDs más altos son más recientes)
          const sortedProducts = [...response.data.products].sort((a, b) => b.id - a.id);
          
          const formattedProducts = sortedProducts.map(product => ({
            ...product,
            price: parseFloat(product.price || 0)
          }));
          
          setLatestProducts(formattedProducts);
        } else {
          console.log('Respuesta exitosa pero sin productos en el formato esperado');
          setLatestProducts([]);
        }
      } catch (err) {
        console.error('Error al cargar los últimos productos:', err);
        
        // Plan B: Obtener todos los productos y ordenarlos
        try {
          console.log('Intentando obtener todos los productos como alternativa...');
          
          const allProductsResponse = await axios.get(`${config.API_URL}/api/products`);
          console.log('Respuesta de todos los productos:', allProductsResponse.data);
          
          // Verificamos si existe allProductsResponse.data.products antes de continuar
          if (allProductsResponse.data && Array.isArray(allProductsResponse.data.products)) {
            let products = allProductsResponse.data.products || [];
            
            // Ordenamos los productos por ID (asumiendo que IDs más altos son más recientes)
            products = products.sort((a, b) => b.id - a.id);
            
            // Tomamos los primeros 6 productos
            const latestProducts = products.slice(0, 6).map(product => ({
              ...product,
              price: parseFloat(product.price || 0)
            }));
            
            if (latestProducts.length > 0) {
              console.log('Productos obtenidos y ordenados manualmente:', latestProducts);
              setLatestProducts(latestProducts);
              return; 
            }
          } else {
            console.log('No se encontraron productos en la respuesta alternativa');
            setLatestProducts([]);
          }
        } catch (fallbackErr) {
          console.error('Error en el fallback:', fallbackErr);
        }
        
        setError('No se pudieron cargar las novedades. Por favor, intenta de nuevo más tarde.');
        
        // Fallback último con productos de ejemplo
        console.log('Usando productos de ejemplo como último recurso');
        setLatestProducts([
          {
            id: 1,
            name: 'Magic the Gathering',
            description: 'Universes Beyond Final Fantasy Play Booster Box',
            price: 20,
            image_url: 'https://s3.amazonaws.com/entrekidscl/vich_files/proveedorarchivo/5f0554ff920cb105242495.jpg',
            category_name: 'Juegos de Cartas',
            game_type: 'Magic'
          },
          {
            id: 2,
            name: 'Pokemon',
            description: 'Prismatic Evolutions Accessory Pouch Special Collection',
            price: 25,
            image_url: 'https://thirdimpact.cl/wp-content/uploads/2025/03/PokemonPrismaticEvolutionsAccessoryPouchSpecialCollection.webp',
            category_name: 'Juegos de Cartas',
            game_type: 'Pokemon'
          },
          {
            id: 3,
            name: 'Dragon Shield',
            description: 'Fundas mate con textura, con un manejo superior.',
            price: 30,
            image_url: 'https://thirdimpact.cl/wp-content/uploads/2021/12/DragonshieldStandardMatteTangerine.jpg',
            category_name: 'Accesorios',
            brand: 'Dragon Shield'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Determinar a dónde navegar cuando se hace clic en un producto
  const getProductDestination = (product) => {
    if (!product) return '/';
    
    return `/producto/${product.id}`;
  };

  // Manejar clic en un producto
  const handleProductClick = (product) => {
    const destination = getProductDestination(product);
    navigate(destination);
  };

  // Mostrar spinner durante la carga inicial
  if (loading && latestProducts.length === 0) {
    return (
      <Container className="mt-5">
        <h2 className="text-center mb-4">Novedades</h2>
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  // Agrupar productos para el carrusel
  const groupedProducts = chunkArray(latestProducts, 3);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Novedades</h2>
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      
      {latestProducts.length > 0 ? (
        <Carousel indicators={false} interval={5000} className="news-carousel">
          {groupedProducts.map((group, index) => (
            <Carousel.Item key={index}>
              <Row className="justify-content-center">
                {group.map((product) => (
                  <Col md={4} key={product.id} className="d-flex justify-content-center">
                    <Card
                      className="mb-3 text-center news-card"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="news-card-image-container">
                        <Card.Img
                          variant="top"
                          src={product.image_url || product.imageUrl || product.image || 'https://placehold.co/300x300?text=Imagen+no+disponible'}
                          className="news-card-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/300x300?text=Imagen+no+disponible';
                          }}
                        />
                      </div>
                      <Card.Body className="news-card-body">
                        <div>
                          <Card.Title className="fw-bold mb-1" style={{ fontSize: '1rem' }}>{product.name}</Card.Title>
                          <Card.Text className="news-card-description">
                            {product.description || product.short_description || product.shortDescription || 'Sin descripción disponible'}
                          </Card.Text>
                        </div>
                        <div className="news-card-footer">
                          <span className="news-card-price">
                            ${product.price?.toFixed(2) || '0.00'}
                          </span>
                          <Button 
                            variant="primary" 
                            size="sm"
                            className="news-card-button"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleProductClick(product);
                            }}
                          >
                            Comprar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Alert variant="info" className="text-center">
          No hay productos nuevos disponibles en este momento.
        </Alert>
      )}
    </Container>
  );
};

export default NewsSection;
