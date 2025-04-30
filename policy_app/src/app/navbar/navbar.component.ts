import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
   userName = localStorage.getItem('username');
   isMenuCollapsed = true;
  
   toggleMenu(){
    this.isMenuCollapsed= !this.isMenuCollapsed;
   }

   logout(){
    localStorage.removeItem('username');
   }
}
