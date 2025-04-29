import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';
  submitted = false;

  onLogin() {
    this.submitted = true;
    this.loginError = '';

    // For demo purposes - replace with actual authentication logic
    if (this.username !== "abc" || this.password !== "123") {
      this.loginError = 'Invalid username or password';
      return;
    }

    console.log('Login successful:', this.username);
    // Add your login success logic here
  }
}