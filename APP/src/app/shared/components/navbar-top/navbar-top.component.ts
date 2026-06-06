import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-top',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: './navbar-top.component.html',
  styleUrl: './navbar-top.component.scss'
})
export class NavbarTopComponent {
  @Input() nomeUsuario = 'Usuário';
  @Output() logoutEvt = new EventEmitter<void>();

  readonly fotoPerfil$ = this.auth.fotoPerfil$;

  constructor(private auth: AuthService) {}

  get iniciais(): string {
    return this.nomeUsuario
      .split(' ')
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }
}
