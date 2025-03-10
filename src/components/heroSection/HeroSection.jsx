import React from "react";
import { Carousel, Container } from "react-bootstrap";
import "../../styles/App.css";
import "./HeroSection.css";

function HeroSection() {
  return (
    <Container fluid className="p-0">
      <Carousel className="hero-carousel" indicators={true} interval={5000}>
        <Carousel.Item>
          <div className="hero-image-container">
            <img
              className="d-block w-100 hero-image"
              src="https://cdnx.jumpseller.com/gaming-place/image/40260475/op_portada.webp?1695856320"
              alt="One Piece TCG"
            />
            <div className="hero-overlay"></div>
          </div>
          <Carousel.Caption className="hero-caption">
            <h2>One Piece TCG</h2>
            <p>¡Descubre las nuevas expansiones disponibles!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="hero-image-container">
            <img
              className="d-block w-100 hero-image"
              src="https://cdn.atomix.vg/wp-content/uploads/2024/08/tcg-.jpg"
              alt="Juegos de Cartas Coleccionables"
            />
            <div className="hero-overlay"></div>
          </div>
          <Carousel.Caption className="hero-caption">
            <h2>Juegos de Cartas Coleccionables</h2>
            <p>Explora nuestra amplia selección de TCGs</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="hero-image-container">
            <img
              className="d-block w-100 hero-image"
              src="https://static.posters.cz/image/hp/77610.jpg"
              alt="Magic: The Gathering"
            />
            <div className="hero-overlay"></div>
          </div>
          <Carousel.Caption className="hero-caption">
            <h2>Magic: The Gathering</h2>
            <p>Nuevas ediciones y cartas exclusivas</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
}

export default HeroSection;
