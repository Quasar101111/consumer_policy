import { Component } from '@angular/core';
import{ FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-change-password',
  imports: [NavbarComponent, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {


   passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  message = '';
  constructor(private apiService: ApiService, private router: Router, private toastr : ToastrService) { }
  onSubmit() {

    if (!this.validatePasswords()) {
      return;
    }

    
    const username = localStorage.getItem('username');
    if (!username) {
      this.toastr.error('Please log in again');
      this.router.navigate(['/login']);
      return;
    }
    
    const passwordVal={
       username,
      currentPassword : this.passwordData.oldPassword,
      newPassword : this. passwordData.newPassword
    }
   
    this.apiService.changePassword(passwordVal).subscribe({
  next: (response) => {
      if (response.message === "Password changed successfully.") {
      this.toastr.success(response.message);
      this.router.navigate(['/home']);
    }
   
    
    
    else {
      this.toastr.error(response.message);
    }
  },
  error: (error) => {
    if (error.status === 400) {
    const backendMessage =  'Current password may be incorrect';
    this.toastr.error(backendMessage);
  } else if (error.error?.message) {
    this.toastr.error(error.error.message);
  } else {
    this.toastr.error('Password change failed. Please try again.');
  }
  }
});

  }


   validatePasswords(): boolean {
    if (!this.passwordData.oldPassword) {
      this.toastr.error('Please enter your current password');
      return false;
    }

    if (!this.passwordData.newPassword) {
      this.toastr.error('Please enter a new password');
      return false;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.error('New passwords do not match');
      return false;
    }

    if (this.passwordData.newPassword.length < 5) {
      this.toastr.error('Password must be at least 6 characters long');
      return false;
    }

    return true;
  }


}
