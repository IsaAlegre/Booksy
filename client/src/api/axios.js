import axios from 'axios';

// 1. Crea una instancia de Axios con la URL base de tu API.
const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL
});

// Esta función se ejecuta ANTES de que cualquier petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    // Obtiene el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si el token existe, lo añade a la cabecera 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Devuelve la configuración modificada para que la petición continúe
    return config;
  },
  (error) => {
    // Maneja errores en la configuración de la petición
    return Promise.reject(error);
  }
);

export default apiClient;