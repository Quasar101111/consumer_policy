import { Component,OnInit} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../services/api.service'; 
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog'
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  imports: [NavbarComponent,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  username :string ='';

  private modal: any;

  constructor() {}

  ngOnInit(): void {
    const modalElement = document.getElementById('welcomeModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
  }

  onUsernameChange(newUsername: string): void {
    this.username = newUsername;
    if (newUsername !== 'Guest' && this.modal) {
      this.modal.show();
    }
  }
}