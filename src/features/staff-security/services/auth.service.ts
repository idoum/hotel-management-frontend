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
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Stocker le token et les infos utilisateur
    this.setToken(response.token);
    this.setUser(response.user);
    
    return response;
  }

  // Déconnexion
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Obtenir le profil utilisateur
  static async getProfile(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.PROFILE);
    this.setUser(response);
    return response;
  }

  // Vérifier le token
  static async verifyToken(): Promise<{ valid: boolean; user?: AuthUser }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY);
      if (response.user) {
        this.setUser(response.user);
      }
      return response;
    } catch (error) {
      this.clearAuth();
      return { valid: false };
    }
  }

  // Réinitialiser le mot de passe
  static async resetPassword(data: ResetPasswordDTO): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  // ============ Gestion locale du token et utilisateur ============

  // Stocker le token
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Configurer l'header Authorization pour les futures requêtes
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Récupérer le token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Stocker les infos utilisateur
  static setUser(user: any): void {
    const authUser: AuthUser = {
      ...user,
      isAuthenticated: true
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(authUser));
  }

  // Récupérer les infos utilisateur
  static getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erreur parsing user depuis localStorage:', error);
      return null;
    }
  }

  // Effacer l'authentification
  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
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
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}
