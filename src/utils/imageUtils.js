import config from './config/config';

/**
 * Obtiene una URL válida para una imagen del producto
 * @param {string} imageUrl - La URL de la imagen del producto
 * @returns {string} - Una URL válida para la imagen
 */
export const getValidImageUrl = (imageUrl) => {
  // Si no hay URL, usar una imagen por defecto
  if (!imageUrl) {
    return 'https://via.placeholder.com/300?text=Imagen+no+disponible';
  }

  // Si la URL ya es completa (comienza con http o https)
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Si la URL comienza con una barra (ruta absoluta)
  if (imageUrl.startsWith('/')) {
    // Asegurar que no haya doble barra si API_URL termina con /
    const baseUrl = config.API_URL.endsWith('/') 
      ? config.API_URL.slice(0, -1) 
      : config.API_URL;
    return `${baseUrl}${imageUrl}`;
  }

  // Para otros casos, asumir que es una ruta relativa a /uploads/
  return `${config.API_URL}/uploads/${imageUrl}`;
};

/**
 * Maneja errores de carga de imagen estableciendo una imagen por defecto
 * @param {Event} event - El evento de error
 */
export const handleImageError = (event) => {
  event.target.onerror = null;
  event.target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
};