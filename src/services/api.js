import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'https://n8n-certidoesapi.r954jc.easypanel.host/api',
});

// Interceptor para adicionar o token JWT em todas as requisições protegidas
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage (ou de onde você o armazenar)
    const token = localStorage.getItem('authToken');
    if (token) {
      // Adiciona o token ao header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;