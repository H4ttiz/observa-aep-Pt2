import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  nome      = this.auth.getNomeUsuario() ?? 'Cidadão';
  tipoUsuario = this.auth.getTipoUsuario() ?? '';

  constructor(private auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
