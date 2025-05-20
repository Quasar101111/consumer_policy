import { Component,EventEmitter,Output } from '@angular/core';
import { ApiService } from '../services/api.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule} from '@angular/material/divider'



@Component({
  selector: 'app-navbar',
  imports: [CommonModule,BsDropdownModule,MatButtonModule,
            MatDividerModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() usernameChange= new EventEmitter<string>();
  userName =localStorage.getItem('username')||'Guest';
  constructor(private router:Router){}

  
  ngOnInit(){
    this.usernameChange.emit(this.userName);
   
  }
  
  

   logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.userName= '';
    this.router.navigate(['/login']).then(() => {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, '', window.location.href);
      };
    }); 
  }
}
