import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
 
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  loginData={
    username: '',
    password: ''
  }
 
  loginError: string = '';
  submitted = false;


  constructor(
    private apiService: ApiService, private router :Router)
   {}

  
  onLogin() {
    this.submitted = true;
    this.loginError = '';
    const login ={
        username : this.loginData.username,
        password : this.loginData.password
    };
  
    this.apiService.login(login).subscribe({next:(response)=>
       {
        localStorage.setItem('username', response.username);
        localStorage.setItem('token', response.token);
         
        this.router.navigate(['/home'])
    },
    error:()=>{
      this.loginError = 'Invalid username or password.';
    }
  })

  }
}