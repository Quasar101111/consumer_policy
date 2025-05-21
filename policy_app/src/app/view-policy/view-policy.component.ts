import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-policy',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './view-policy.component.html',
  styleUrl: './view-policy.component.scss'
})
export class ViewPolicyComponent {
}
