const config = {
  // En producción (cuando se despliega en Netlify), usa la URL del backend en Render
  API_URL: import.meta.env.VITE_API_URL || 'https://ecommerce-serv.onrender.com',
};

export default config;
