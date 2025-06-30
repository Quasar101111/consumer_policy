import { Component,OnInit} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../services/api.service'; 
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  username ="";
  msg :number= 0;
  private modal: any;
  policy:string[] = [];
  totalPremiumvar :number= 0;
   
  constructor(private eventService: EventService, private apiService : ApiService) {}

 
  ngOnInit(): void {
    const modalElement = document.getElementById('welcomeModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
    this.eventService.welMsgs.subscribe(value => {
      this.msg = value;
    });

      this.username = localStorage.getItem('username') || '';

    this.apiService.viewPolicyNumbers(this.username).subscribe({next:(response)=>
    {
        if (Array.isArray(response)) {
        this.policy = response;
        }
      
      },

    })

    this.apiService.totalPremium(this.username).subscribe({next: (response)=>{

      if(response){
        this.totalPremiumvar= response;
      }
    }})

  }
  
   
   
  onUsernameChange(newUsername: string): void {
    this.username = newUsername;
    if (newUsername !== 'Guest' && this.modal && this.msg==1) {
      this.modal.show();
      this.eventService.sendWelcomeMessage(0);
    }
  }
 
}