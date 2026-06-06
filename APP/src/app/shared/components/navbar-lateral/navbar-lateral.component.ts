import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navbar-lateral',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, MatIconModule, MatTooltipModule],
  templateUrl: './navbar-lateral.component.html',
  styleUrl: './navbar-lateral.component.scss'
})
export class NavbarLateralComponent {
  @Input() items: NavItem[] = [];
  @Input() activeItem = '';
  @Output() itemSelected = new EventEmitter<string>();

  collapsed = false;

  toggle(): void { this.collapsed = !this.collapsed; }

  select(id: string): void { this.itemSelected.emit(id); }
}
