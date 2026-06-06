import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard, roleRedirectGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth-page/auth-page.component').then(m => m.AuthPageComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, roleRedirectGuard],
    // roleRedirectGuard sempre redireciona, nunca renderiza componente
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard/cidadao',
    loadComponent: () =>
      import('./features/dashboard/cidadao/dashboard-cidadao.component').then(m => m.DashboardCidadaoComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CIDADAO'] }
  },
  {
    path: 'dashboard/atendente',
    loadComponent: () =>
      import('./features/dashboard/atendente/dashboard-atendente.component').then(m => m.DashboardAtendenteComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ATENDENTE'] }
  },
  {
    path: 'dashboard/gestor',
    loadComponent: () =>
      import('./features/dashboard/gestor/dashboard-gestor.component').then(m => m.DashboardGestorComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GESTOR'] }
  },
  {
    path: 'dashboard/admin',
    loadComponent: () =>
      import('./features/dashboard/admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },
  {
    path: 'dashboard/admin/usuarios/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/usuario-detalhe/usuario-detalhe-admin.component').then(m => m.UsuarioDetalheAdminComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard]
  },
  { path: '',   redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
