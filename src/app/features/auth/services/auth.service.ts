// import { Injectable, signal } from '@angular/core';
// import { Observable, of, throwError, delay } from 'rxjs';
// import { User, LoginRequest, RegisterRequest } from '../models/user.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUser = signal<User | null>(null);
//   public currentUser$ = this.currentUser.asReadonly();

//   private users: User[] = [
//     {
//       id: 1,
//       email: 'admin@example.com',
//       password: 'admin123', // En production, ce serait hashé
//       role: 'admin',
//       createdAt: new Date('2024-01-01'),
//     },
//     {
//       id: 2,
//       email: 'user@example.com',
//       password: 'user123',
//       role: 'user',
//       createdAt: new Date('2024-01-02'),
//     },
//   ];

//   // Simuler un délai réseau
//   private delay(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   // POST - Connexion
//   async login(
//     credentials: LoginRequest,
//   ): Promise<{ success: boolean; user?: User; error?: string }> {
//     console.warn('🔄 Service: Tentative de connexion...', credentials.email);
//     await this.delay(500);

//     const user = this.users().find(
//       (u) => u.email === credentials.email && u.password === credentials.password,
//     );

//     if (user) {
//       this.currentUser.set(user);
//       console.warn('✅ Service: Connexion réussie pour:', user.email);
//       return { success: true, user };
//     } else {
//       console.error('❌ Service: Échec de connexion pour:', credentials.email);
//       return { success: false, error: 'Email ou mot de passe incorrect' };
//     }
//   }

//   // POST - Inscription
//   async register(
//     userData: RegisterRequest,
//   ): Promise<{ success: boolean; user?: User; error?: string }> {
//     console.warn("🔄 Service: Tentative d'inscription...", userData.email);
//     await this.delay(600);

//     // Vérifier si l'email existe déjà
//     if (this.users().some((u) => u.email === userData.email)) {
//       console.error('❌ Service: Email déjà utilisé:', userData.email);
//       return { success: false, error: 'Cet email est déjà utilisé' };
//     }

//     // Vérifier que les mots de passe correspondent
//     if (userData.password !== userData.confirmPassword) {
//       console.error('❌ Service: Mots de passe différents');
//       return { success: false, error: 'Les mots de passe ne correspondent pas' };
//     }

//     const newUser: User = {
//       id: Date.now(),
//       email: userData.email,
//       password: userData.password,
//       role: 'user',
//       createdAt: new Date(),
//     };

//     this.users.update((users) => [...users, newUser]);
//     this.currentUser.set(newUser);

//     console.warn('✅ Service: Inscription réussie pour:', newUser.email);
//     return { success: true, user: newUser };
//   }

//   // POST - Déconnexion
//   async logout(): Promise<void> {
//     console.warn('🔄 Service: Déconnexion...');
//     await this.delay(200);
//     this.currentUser.set(null);
//     console.warn('✅ Service: Déconnexion réussie');
//   }

//   // GET - Vérifier si l'utilisateur est connecté
//   isAuthenticated(): boolean {
//     return this.currentUser() !== null;
//   }

//   // GET - Récupérer l'utilisateur actuel
//   getCurrentUser(): User | null {
//     return this.currentUser();
//   }

//   // GET - Vérifier si l'utilisateur est admin
//   isAdmin(): boolean {
//     return this.currentUser()?.role === 'admin';
//   }

//   // GET - Récupérer tous les utilisateurs (admin seulement)
//   async getAllUsers(): Promise<User[]> {
//     console.warn('🔄 Service: Récupération de tous les utilisateurs...');
//     await this.delay(400);

//     if (!this.isAdmin()) {
//       throw new Error('Accès non autorisé');
//     }

//     console.warn('✅ Service: Utilisateurs récupérés');
//     return this.users().map((user) => ({
//       ...user,
//       password: '***', // Masquer les mots de passe
//     }));
//   }
// }

import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data - utilisateurs de test
  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      password: '',
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user',
      password: '',
    },
  ];

  // Mock data - mots de passe (en réalité, ils seraient hashés)
  private passwords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  constructor() {
    // Vérifier s'il y a un utilisateur en session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simuler un délai réseau
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
      password: '',
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    // Simuler un délai réseau
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Méthode pour définir l'utilisateur connecté (utilisée après login)
  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
