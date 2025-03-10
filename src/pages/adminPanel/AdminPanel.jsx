import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    short_description: '',
    full_description: '',
    image_url: '',
    category_id: '',
    brand: '',           
    game_type: ''        
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 
  const accessoryBrands = [
    'Dragon Shield',
    'BCW',
    'Bandai',
    'Mirror Shield',
    'Turtle'
  ];

 
  const gameTypes = [
    'One Piece',
    'Digimon',
    'Pokemon',
    'Dragon Ball',
    'Lorcana',
    'Mitos y Leyenda',
    'Magic',
    'Hunter X',
    'Yu-Gi-Oh'
  ];

 
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }
      
      try {
        const response = await axios.get(`${config.API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.user.role !== 'admin') {
          
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
        
        
        fetchProducts();
        fetchCategories();
      } catch (error) {
        console.error('Error al verificar permisos:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);


  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      
      const formattedProducts = response.data.products.map(product => ({
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity)
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      showAlertMessage('danger', 'Error al cargar productos');
    }
  };

  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/products/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      showAlertMessage('danger', 'Error al cargar categorías');
    }
  };

 
  const showAlertMessage = (variant, message) => {
    setAlert({
      show: true,
      variant,
      message
    });
    
   
    setTimeout(() => {
      setAlert({ show: false, variant: '', message: '' });
    }, 3000);
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    
    
    setFormData({
      ...formData,
      category_id: value,
      brand: '',
      game_type: ''
    });
  };

 
  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.id === parseInt(formData.category_id));
    return category ? category.name.toLowerCase() : '';
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleAddProduct = () => {
    setEditMode(false);
    setFormData({
      name: '',
      price: '',
      quantity: '',
      short_description: '',
      full_description: '',
      image_url: '',
      category_id: '',
      brand: '',
      game_type: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

 
  const handleEditProduct = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      short_description: product.short_description,
      full_description: product.full_description,
      image_url: product.image_url || '',
      category_id: product.category_id,
      brand: product.brand || '',
      game_type: product.game_type || ''
    });
    
    setImagePreview(product.image_url || '');
    setShowModal(true);
  };

  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  
  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      const formDataImage = new FormData();
      formDataImage.append('image', imageFile);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${config.API_URL}/api/upload`, formDataImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      showAlertMessage('danger', 'Error al subir la imagen');
      return null;
    }
  };

  
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
     
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }
      
    
      const categoryName = getSelectedCategoryName();
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image_url: imageUrl,
        
        brand: categoryName === 'accesorios' ? formData.brand : '',
        
        game_type: ['juegos de cartas', 'singles'].includes(categoryName) ? formData.game_type : ''
      };
      
      
      if (editMode) {
        await axios.put(`${config.API_URL}/api/products/${selectedProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showAlertMessage('success', 'Producto actualizado con éxito');
      } else {
        await axios.post(`${config.API_URL}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showAlertMessage('success', 'Producto creado con éxito');
      }
      
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      showAlertMessage('danger', `Error al ${editMode ? 'actualizar' : 'crear'} producto: ${error.response?.data?.message || error.message}`);
    }
  };

  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.API_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
       
        setProducts(products.filter(product => product.id !== productId));
        showAlertMessage('success', 'Producto eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        showAlertMessage('danger', 'Error al eliminar producto');
      }
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Cargando...</h3>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    return null; 
  }


  const selectedCategoryName = getSelectedCategoryName();
  const isAccessories = selectedCategoryName === 'accesorios';
  const isCardGamesOrSingles = ['juegos de cartas', 'singles'].includes(selectedCategoryName);

  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Panel de Administración</h1>
      
      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ ...alert, show: false })}>
          {alert.message}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Gestión de Productos</h3>
          <Button variant="success" onClick={handleAddProduct}>
            Agregar Nuevo Producto
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Detalle</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category_name || 'Sin categoría'}</td>
                    <td>
                      {product.brand && <span>Marca: {product.brand}</span>}
                      {product.game_type && <span>Juego: {product.game_type}</span>}
                    </td>
                    <td>${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">No hay productos disponibles</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
     
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
          
            {isAccessories && (
              <Form.Group className="mb-3">
                <Form.Label>Marca</Form.Label>
                <Form.Select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar marca</option>
                  {accessoryBrands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            {isCardGamesOrSingles && (
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Juego</Form.Label>
                <Form.Select
                  name="game_type"
                  value={formData.game_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar tipo de juego</option>
                  {gameTypes.map((game, index) => (
                    <option key={index} value={game}>
                      {game}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción Corta</Form.Label>
              <Form.Control
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción Completa</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="full_description"
                value={formData.full_description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </div>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
