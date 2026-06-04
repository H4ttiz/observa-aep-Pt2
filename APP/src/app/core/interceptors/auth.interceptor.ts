import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const PUBLIC_URLS = ['/auth/login', '/auth/cadastro', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
  if (isPublic) return next(req);

  const token = inject(AuthService).getToken();
  if (!token) return next(req);

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
