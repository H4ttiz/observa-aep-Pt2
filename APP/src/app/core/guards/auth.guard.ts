import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

function tokenExpirado(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const toast  = inject(ToastService);
  const router = inject(Router);

  const token = auth.getToken();

  if (!token) {
    router.navigate(['/auth']);
    return false;
  }

  if (tokenExpirado(token)) {
    toast.error('Sua sessão expirou. Faça login novamente.');
    auth.limparSessao();
    return false;
  }

  return true;
};
