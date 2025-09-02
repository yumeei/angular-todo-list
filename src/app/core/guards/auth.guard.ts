import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
// import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    console.warn('currentUser true');
    return true; // Accès autorisé
  } else {
    // Rediriger vers login avec l'URL de retour
    console.warn('currentUser false');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Accès refusé
  }
};
