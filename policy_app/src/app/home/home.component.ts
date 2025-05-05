import { Component,OnInit} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../services/api.service'; 
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  username :string ='';
  msg :number= 0;
  private modal: any;

  constructor(private eventService: EventService) {}

 
  ngOnInit(): void {
    const modalElement = document.getElementById('welcomeModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
    this.eventService.welMsgs.subscribe(value => {
      this.msg = value;
    });
   
    
    
  }
  
   
   
  onUsernameChange(newUsername: string): void {
    this.username = newUsername;
    if (newUsername !== 'Guest' && this.modal && this.msg==1) {
      this.modal.show();
      this.eventService.sendWelcomeMessage(0);
    }
  }
 
}