import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

// Créer l'instance axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    // ✅ Protection SSR - seulement côté client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hotel_auth_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    
    return response.data; // Retourner directement les données
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Gestion des erreurs spécifiques
    if (error.response) {
      const { status, data } = error.response;
      
      // Token expiré ou invalide
      if (status === 401 && typeof window !== 'undefined') {
        // Nettoyer l'authentification
        localStorage.removeItem('hotel_auth_token');
        localStorage.removeItem('hotel_auth_user');
        
        // Rediriger vers login si pas déjà sur la page de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Créer une erreur personnalisée avec le message du serveur
      const errorMessage = data?.message || data?.error || `Erreur HTTP ${status}`;
      const customError = new Error(errorMessage);
      (customError as any).name = `APIError${status}`;
      (customError as any).status = status;
      (customError as any).data = data;
      
      return Promise.reject(customError);
    }
    
    // Erreur réseau
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      const networkError = new Error('Erreur de connexion au serveur - Vérifiez que le backend est démarré');
      (networkError as any).name = 'NetworkError';
      return Promise.reject(networkError);
    }
    
    // Erreur timeout
    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error('Délai d\'attente dépassé');
      (timeoutError as any).name = 'TimeoutError';
      return Promise.reject(timeoutError);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
