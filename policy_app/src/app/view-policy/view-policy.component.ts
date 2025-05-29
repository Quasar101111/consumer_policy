import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-policy',
  imports: [NavbarComponent,CommonModule,NgSelectModule, FormsModule],
  templateUrl: './view-policy.component.html',
  styleUrl: './view-policy.component.scss'
})

export class ViewPolicyComponent {

  policies: string[] = [];
  selectedPolicy: string = '';
  errorOccurred = false;
  errMsg = '';


  constructor(private apiService: ApiService, private router: Router){
  }
  username='';
  ngOnInit():void{
    this.username = localStorage.getItem('username') || '';
    this.apiService.viewPolicyNumbers(this.username).subscribe({next :(response)=> {
      console.log('API response:', response); 
       if (Array.isArray(response)) {
        this.policies = response;}
        
      
    
      
     },
    error: (err) => {
      console.error('API error:', err);
      this.errorOccurred = true;

      if (err.status === 404) {
        
        const errorMessage = err.error?.Message || 'No policies found';
        this.errMsg = errorMessage;
      } else {
        this.policies = ['An unexpected error occurred'];
      }
    }


    })

  }





}

