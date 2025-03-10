import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CategoriesSection.css';

const categories = [
  { id: 1, name: 'Pokemon', gameType: 'Pokemon', image: 'https://sm.ign.com/t/ign_es/lists/e/every-poke/every-pokemon-game-on-the-nintendo-switch-in-2024_rkq1.1280.jpg' },
  { id: 2, name: 'Magic: The Gathering', gameType: 'Magic', image: 'https://contrapunto.cl/cdn/shop/files/30518.jpg?v=1725989985&width=600' },
  { id: 3, name: 'One Piece', gameType: 'One Piece', image: 'https://www.cartasmagicsur.cl/wp-content/uploads/2023/03/One-Piece-TCG.png-magicsur.png' },
  { id: 4, name: 'Yu-Gi-Oh!', gameType: 'Yu-Gi-Oh', image: 'https://assetsio.gnwcdn.com/yu-gi-oh-illusion-monster-card-nightmare-magician-artwork.jpg?width=1920&height=1920&fit=bounds&quality=80&format=jpg&auto=webp' },
  { id: 5, name: 'Hunter X', gameType: 'Hunter X', image: 'https://cardotaku.com/cdn/shop/collections/mv-2.jpg?v=1679389262&width=1800' },
  { id: 6, name: 'Dragón Ball', gameType: 'Dragon Ball', image: 'https://www.afkstore.cl/cdn/shop/collections/maxresdefault_4.jpg?v=1732671426&width=750' },
  { id: 7, name: 'Digimón', gameType: 'Digimon', image: 'https://mundodigitaltoday.wordpress.com/wp-content/uploads/2020/12/2012-05-digimon-card-game-tcg-01.jpg' },
  { id: 8, name: 'Mitos y leyendas', gameType: 'Mitos y Leyenda', image: 'https://www.latercera.com/resizer/v2/RXNXC7MPJ5FOPBH7VLIANYUKZI.jpg?quality=80&smart=true&auth=3914bd0711bc28ce87393f62a5184f9591207f46a772d573b860c9a607ff8458&width=690&height=502' },
  { id: 9, name: 'Lorcana', gameType: 'Lorcana', image: 'https://es.gizmodo.com/app/uploads/2022/08/146c0a9c32540648f5cd37bdf7c67c44-680x381.jpg' },
];

const CategoriesSection = () => {
  const navigate = useNavigate();


  const handleCategoryClick = (gameType) => {
  
    const encodedGameType = encodeURIComponent(gameType);
    
    navigate(`/juegos-de-cartas?selectedCategory=${encodedGameType}`);
  };

  return (
    <Container className="categories-container">
      <h2 className="categories-title">Categorías</h2>
      <Row className="categories-row g-3">
        {categories.map((category) => (
          <Col xs={12} sm={6} md={4} key={category.id} className="category-col">
            <Card 
              className="category-card" 
              onClick={() => handleCategoryClick(category.gameType)}
            >
              <div className="category-image-container">
                <Card.Img 
                  variant="top" 
                  src={category.image} 
                  className="category-image"
                  alt={category.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
                  }}
                />
              </div>
              <Card.Body className="category-body">
                <Card.Title className="category-title">{category.name}</Card.Title>
                <button className="btn btn-primary category-button">
                  Ver productos
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoriesSection;