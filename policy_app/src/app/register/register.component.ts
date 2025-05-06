import { Component,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  registerData={
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    email: ''

  };
  submitted = false;
  usernameTaken = false;
  passwordMismatch = false;
  errorMessage ='';
  successMessage =false;
  constructor(
    private apiService: ApiService, private router :Router)
   {}
   

   
  checkUsername() {
    
    if(this.registerData.username){
      
      this.apiService.checkUsername(this.registerData.username).subscribe({next:()=> {
        this.usernameTaken = false;
      },
      error: (error)=> {
        if (error.status === 409 || error.status==400) {
          this.usernameTaken = true;
        } else {
          console.error('Error checking username:', error);
        }
      }
    });
  }
}
  checkPasswordMatch() {
    this.passwordMismatch = this.registerData.password !== this.registerData.confirmPassword;
  }

  onRegister() {
    this.submitted = true;
    this.checkUsername();
    this.checkPasswordMatch();
  

    if (this.passwordMismatch || this.usernameTaken) {
      return;
    }

    const user={
      username: this.registerData.username,
      fullName: this.registerData.fullName,
      password: this.registerData.password,
      email: this.registerData.email,
    };
    
    this.apiService.register(user).subscribe({next:(response)=> {
      this.successMessage =true;
      setTimeout(()=>{
      this.router.navigate(['/login']);},4000);
    },
    error:(error)=>{
    console.error("Registration failed ", error);
    this.errorMessage =  'Registration failed. Please try again.';
    }

  });

    console.log('Registration data:', this.registerData);
  }
}
