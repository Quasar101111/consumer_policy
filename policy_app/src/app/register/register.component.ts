import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
 
  checkUsername() {
    // TODO: Implement username check logic
    // For now, just simulating a check
    this.usernameTaken = false;
  }
  checkPasswordMatch() {
    this.passwordMismatch = this.registerData.password !== this.registerData.confirmPassword;
  }

  onRegister() {
    this.submitted = true;
    
    // Check if passwords match
    this.passwordMismatch = this.registerData.password !== this.registerData.confirmPassword;

    if (this.passwordMismatch) {
      return;
    }

    // TODO: Implement registration logic
    console.log('Registration data:', this.registerData);
  }
}
