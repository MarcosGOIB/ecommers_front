import React from 'react';
import NewsSection from '../../components/novedades/NewsSection';
import CategoriesSection from '../../components/seccionProductos/CategoriesSection';
import HeroSection from '../../components/heroSection/HeroSection';

const Home = () => {
  return (
    <div>
      
      <HeroSection />
      <NewsSection />
      <CategoriesSection />
      
    </div>
  );
};

export default Home;