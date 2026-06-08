import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const roles: string[] = route.data['roles'] ?? [];
  const tipo = localStorage.getItem('oa_tipoUsuario') ?? '';
  const router = inject(Router);
  if (roles.includes(tipo)) return true;
  router.navigate(['/dashboard']);
  return false;
};

export const roleRedirectGuard: CanActivateFn = () => {
  const tipo = localStorage.getItem('oa_tipoUsuario') ?? '';
  const router = inject(Router);
  const mapa: Record<string, string> = {
    CIDADAO:       '/dashboard/cidadao',
    ATENDENTE:     '/dashboard/atendente',
    GESTOR:        '/dashboard/gestor',
    ADMINISTRADOR: '/dashboard/admin'
  };
  const dest = mapa[tipo];
  if (dest) { router.navigate([dest]); } else { router.navigate(['/auth']); }
  return false;
};
