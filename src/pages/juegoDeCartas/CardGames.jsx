import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Modal,
  Button,
  Alert,
  Collapse,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import "./ProductPages.css";
import PaginationComponent from "../../components/pagination/PaginationComponent";
import config from '../../config/config';

const categories = [
  { id: 1, name: "Pokemon", gameType: "Pokemon" },
  { id: 2, name: "Magic: The Gathering", gameType: "Magic" },
  { id: 3, name: "One Piece", gameType: "One Piece" },
  { id: 4, name: "Yu-Gi-Oh!", gameType: "Yu-Gi-Oh" },
  { id: 5, name: "Hunter X", gameType: "Hunter X" },
  { id: 6, name: "Dragón Ball", gameType: "Dragon Ball" },
  { id: 7, name: "Digimón", gameType: "Digimon" },
  { id: 8, name: "Mitos y leyendas", gameType: "Mitos y Leyenda" },
  { id: 9, name: "Lorcana", gameType: "Lorcana" },
];

const CardGames = () => {
  const location = useLocation();

  const getInitialSelectedCategories = () => {
    const params = new URLSearchParams(location.search);
    const selectedCategory = params.get("selectedCategory");
    return selectedCategory ? [selectedCategory] : [];
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardProducts, setCardProducts] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 100]);

  const [selectedCategories, setSelectedCategories] = useState(
    getInitialSelectedCategories()
  );

  const [showModal, setShowModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  const formatPriceCLP = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchCardProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
        `${config.API_URL}/api/products/category/juegos-de-cartas`
        );

        const formattedProducts = response.data.products.map((product) => ({
          ...product,
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity || 0),
        }));

        setCardProducts(formattedProducts);

        if (formattedProducts.length > 0) {
          const maxPrice = Math.max(
            ...formattedProducts.map((product) => product.price)
          );
          setPriceRange([0, maxPrice]);
        }
      } catch (err) {
        console.error("Error al cargar productos de juegos de cartas:", err);
        setError(
          "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCardProducts();
  }, []);

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (gameType) => {
    if (selectedCategories.includes(gameType)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== gameType));
    } else {
      setSelectedCategories([...selectedCategories, gameType]);
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

  const filteredProducts = cardProducts.filter((product) => {
    const isInPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const isCategorySelected =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.game_type);
    return isInPriceRange && isCategorySelected;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    window.scrollTo({
      top: document.querySelector(".section-title").offsetTop - 100,
      behavior: "smooth",
    });
  };

  if (loading && cardProducts.length === 0) {
    return (
      <Container className="products-container">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Cargando juegos de cartas...
            </span>
          </div>
          <h3 className="mt-3">Cargando juegos de cartas...</h3>
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
            <i className={`fa fa-chevron-${showFilters ? "up" : "down"}`}></i>
          </Button>

          <Collapse in={showFilters}>
            <div className="mt-3">
              <div className="filter-panel">
                <h4>Filtrar por:</h4>

                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Categoría</Card.Title>
                    {categories.map((category) => (
                      <Form.Check
                        key={category.id}
                        type="checkbox"
                        id={`category-mobile-${category.id}`}
                        label={category.name}
                        checked={selectedCategories.includes(category.gameType)}
                        onChange={() => handleCategoryChange(category.gameType)}
                        className="mb-2"
                      />
                    ))}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Card.Title>Rango de Precio</Card.Title>
                    <Form.Label className="price-range-label">
                      {formatPriceCLP(priceRange[0])} -{" "}
                      {formatPriceCLP(priceRange[1])}
                    </Form.Label>
                    <Form.Range
                      min={0}
                      max={
                        cardProducts.length > 0
                          ? Math.max(...cardProducts.map((p) => p.price))
                          : 100
                      }
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange([
                          priceRange[0],
                          parseInt(e.target.value, 10),
                        ])
                      }
                    />
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
                <Card.Title>Categoría</Card.Title>
                {categories.map((category) => (
                  <Form.Check
                    key={category.id}
                    type="checkbox"
                    id={`category-${category.id}`}
                    label={category.name}
                    checked={selectedCategories.includes(category.gameType)}
                    onChange={() => handleCategoryChange(category.gameType)}
                    className="mb-2"
                  />
                ))}
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Rango de Precio</Card.Title>
                <Form.Label className="price-range-label">
                  {formatPriceCLP(priceRange[0])} -{" "}
                  {formatPriceCLP(priceRange[1])}
                </Form.Label>
                <Form.Range
                  min={0}
                  max={
                    cardProducts.length > 0
                      ? Math.max(...cardProducts.map((p) => p.price))
                      : 100
                  }
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceRangeChange([
                      priceRange[0],
                      parseInt(e.target.value, 10),
                    ])
                  }
                />
              </Card.Body>
            </Card>
          </div>
        </Col>

        <Col lg={9}>
          <h1 className="section-title">Juegos de Cartas</h1>

          {error && <Alert variant="danger">{error}</Alert>}

          {filteredProducts.length > 0 ? (
            <>
              <Row className="g-3">
                {currentItems.map((product) => (
                  <Col md={6} lg={4} key={product.id}>
                    <Card
                      className="product-card"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="product-img-container">
                        <Card.Img
                          className="product-img"
                          src={
                            product.image_url ||
                            "https://via.placeholder.com/300?text=Imagen+no+disponible"
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300?text=Imagen+no+disponible";
                          }}
                        />
                      </div>
                      <Card.Body className="product-card-body">
                        <h5 className="product-title">{product.name}</h5>
                        <p className="product-description">
                          {product.short_description ||
                            `${product.game_type || "Juego"} - ${product.name}`}
                        </p>
                        <div className="product-card-footer">
                          <div>
                            <span className="product-price">
                              {formatPriceCLP(product.price)}
                            </span>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            className="buy-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
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
              No se encontraron productos que coincidan con los filtros
              seleccionados.
            </Alert>
          )}
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        className="product-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <div className="product-modal-img-container">
                  <img
                    src={
                      selectedProduct.image_url ||
                      "https://via.placeholder.com/300?text=Imagen+no+disponible"
                    }
                    alt={selectedProduct.name}
                    className="product-modal-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300?text=Imagen+no+disponible";
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="product-detail-title">{selectedProduct.name}</h4>
                <p className="product-detail-description">
                  {selectedProduct.short_description}
                </p>
                {selectedProduct.game_type && (
                  <p className="product-detail-meta">
                    <strong>Tipo:</strong> {selectedProduct.game_type}
                  </p>
                )}
                <div className="product-detail-price">
                  {formatPriceCLP(selectedProduct.price)}
                </div>
                <p
                  className={`stock-info ${
                    selectedProduct.quantity > 0
                      ? "stock-available"
                      : "stock-unavailable"
                  }`}
                >
                  {selectedProduct.quantity > 0
                    ? `Stock disponible: ${selectedProduct.quantity} unidades`
                    : "Producto sin stock disponible"}
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
                    disabled={
                      !selectedProduct.quantity || selectedProduct.quantity < 1
                    }
                    className="mt-2"
                  >
                    {!selectedProduct.quantity || selectedProduct.quantity < 1
                      ? "Sin stock"
                      : "Agregar al carrito"}
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          {selectedProduct && selectedProduct.full_description && (
            <div className="mt-4">
              <h5 className="mb-3">Descripción detallada:</h5>
              <p className="product-detail-description">
                {selectedProduct.full_description}
              </p>
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
            disabled={
              !selectedProduct?.quantity || selectedProduct?.quantity < 1
            }
          >
            Agregar al carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CardGames;
