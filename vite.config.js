import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // El proxy solo es necesario en entorno de desarrollo
  // En producción, las peticiones irán directamente a la URL de la API
  const serverOptions = isProduction ? {} : {
    proxy: {
      // Redirigir las solicitudes de API al backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Redirigir las solicitudes de imágenes al backend
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  };

  return {
    plugins: [react()],
    server: serverOptions
  };
});