import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

const PUBLIC_URLS = ['/auth/login', '/auth/cadastro', '/auth/refresh', '/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
  if (isPublic) return next(req);

  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        toast.error('Sua sessão expirou. Faça login novamente.');
        auth.limparSessao();
      } else if (err.status === 403) {
        toast.error('Você não tem permissão para realizar esta ação.');
      }
      return throwError(() => err);
    })
  );
};
