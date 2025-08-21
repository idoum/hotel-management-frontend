import { apiClient } from '@/lib/api';
import { 
  LoginRequest, 
  LoginResponse, 
  AuthUser, 
  ResetPasswordDTO 
} from '../types/staff-security.types';
import { API_ENDPOINTS } from '@/lib/constants';

export class AuthService {
  private static readonly TOKEN_KEY = 'hotel_auth_token';
  private static readonly USER_KEY = 'hotel_auth_user';

  // Connexion
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🚀 AuthService: Attempting login for:', credentials.identifier);
    
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Validation de la réponse
      if (!response.token || !response.user) {
        throw new Error('Réponse de connexion invalide');
      }

      // Stocker le token et les infos utilisateur
      this.setToken(response.token);
      this.setUser(response.user);
      
      console.log('✅ AuthService: Login successful for:', response.user.username);
      return response;
    } catch (error: any) {
      console.error('❌ AuthService: Login failed:', error);
      
      // Nettoyer en cas d'erreur
      this.clearAuth();
      
      // Relancer l'erreur avec un message plus clair
      if (error.response?.status === 401) {
        throw new Error('Identifiants invalides');
      } else if (error.response?.status === 403) {
        throw new Error('Compte désactivé');
      } else if (error.message === 'Network Error') {
        throw new Error('Erreur de connexion au serveur');
      } else {
        throw new Error(error.response?.data?.message || 'Erreur de connexion');
      }
    }
  }

  // Déconnexion
  static async logout(): Promise<void> {
    console.log('🚀 AuthService: Logging out...');
    
    try {
      // Tenter la déconnexion côté serveur
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      console.log('✅ AuthService: Server logout successful');
    } catch (error) {
      console.warn('⚠️ AuthService: Server logout failed (continuing with client cleanup):', error);
    } finally {
      // Toujours nettoyer côté client
      this.clearAuth();
      console.log('✅ AuthService: Client cleanup completed');
    }
  }

  // Obtenir le profil utilisateur
  static async getProfile(): Promise<AuthUser> {
    console.log('🚀 AuthService: Fetching user profile...');
    
    try {
      const response = await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.PROFILE);
      
      // Mettre à jour les données locales
      const enrichedUser = {
        ...response,
        isAuthenticated: true
      };
      
      this.setUser(enrichedUser);
      console.log('✅ AuthService: Profile fetched for:', response.username);
      return enrichedUser;
    } catch (error: any) {
      console.error('❌ AuthService: Profile fetch failed:', error);
      
      // En cas d'erreur d'auth, nettoyer
      if (error.response?.status === 401) {
        this.clearAuth();
      }
      
      throw error;
    }
  }

  // Vérifier le token
  static async verifyToken(): Promise<{ valid: boolean; user?: AuthUser }> {
    console.log('🚀 AuthService: Verifying token...');
    
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY);
      
      if (response.valid && response.user) {
        const enrichedUser = {
          ...response.user,
          isAuthenticated: true
        };
        this.setUser(enrichedUser);
        console.log('✅ AuthService: Token valid for:', response.user.username);
        return { valid: true, user: enrichedUser };
      } else {
        console.log('⚠️ AuthService: Token invalid');
        this.clearAuth();
        return { valid: false };
      }
    } catch (error: any) {
      console.error('❌ AuthService: Token verification failed:', error);
      this.clearAuth();
      return { valid: false };
    }
  }

  // Réinitialiser le mot de passe
  static async resetPassword(data: ResetPasswordDTO): Promise<void> {
    console.log('🚀 AuthService: Resetting password for:', data.email);
    
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      console.log('✅ AuthService: Password reset successful');
    } catch (error: any) {
      console.error('❌ AuthService: Password reset failed:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    }
  }

  // ============ Gestion locale du token et utilisateur ============

  // Stocker le token
  static setToken(token: string): void {
    if (typeof window === 'undefined') return; // Protection SSR
    
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      // Configurer l'header Authorization pour les futures requêtes
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('✅ AuthService: Token stored and configured');
    } catch (error) {
      console.error('❌ AuthService: Failed to store token:', error);
    }
  }

  // Récupérer le token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null; // Protection SSR
    
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('❌ AuthService: Failed to get token:', error);
      return null;
    }
  }

  // Stocker les infos utilisateur
  static setUser(user: any): void {
    if (typeof window === 'undefined') return; // Protection SSR
    
    try {
      const authUser: AuthUser = {
        ...user,
        isAuthenticated: true
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(authUser));
      console.log('✅ AuthService: User data stored for:', user.username);
    } catch (error) {
      console.error('❌ AuthService: Failed to store user:', error);
    }
  }

  // Récupérer les infos utilisateur
  static getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null; // Protection SSR
    
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      // Vérifier que les données sont valides
      if (!user.user_id || !user.username) {
        console.warn('⚠️ AuthService: Invalid user data found, clearing...');
        this.clearAuth();
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('❌ AuthService: Failed to parse user data:', error);
      this.clearAuth();
      return null;
    }
  }

  // Effacer l'authentification
  static clearAuth(): void {
    if (typeof window === 'undefined') return; // Protection SSR
    
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
      console.log('✅ AuthService: Auth data cleared');
    } catch (error) {
      console.error('❌ AuthService: Failed to clear auth:', error);
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const isAuth = !!(token && user && user.isAuthenticated);
    console.log('🔍 AuthService: Authentication check:', isAuth);
    return isAuth;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  static hasRole(roleName: string): boolean {
    const user = this.getUser();
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.role_name === roleName);
  }

  // Vérifier si l'utilisateur a une permission spécifique
  static hasPermission(permissionName: string): boolean {
    const user = this.getUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permissionName);
  }

  // Initialiser l'authentification au démarrage de l'app
  static initializeAuth(): void {
    if (typeof window === 'undefined') return; // Protection SSR
    
    console.log('🔄 AuthService: Initializing authentication...');
    
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('✅ AuthService: Authorization header configured');
    } else {
      console.log('ℹ️ AuthService: No token found');
    }
  }

  // Obtenir des informations de debug
  static getDebugInfo() {
    return {
      hasToken: !!this.getToken(),
      hasUser: !!this.getUser(),
      isAuthenticated: this.isAuthenticated(),
      user: this.getUser(),
      tokenLength: this.getToken()?.length || 0
    };
  }
}
