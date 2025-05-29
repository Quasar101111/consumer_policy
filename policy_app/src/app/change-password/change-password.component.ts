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
      oldPassword : this.passwordData.oldPassword,
      newPassword : this. passwordData.newPassword
    }
    this.apiService.changePassword(passwordVal).subscribe({
  next: (response) => {
    if (response === 0) {
      this.toastr.success('Password Changed');
      this.router.navigate(['/home']);
    } else if (response === 1) {
      this.toastr.error('Current password is incorrect');
    } else {
      this.toastr.error('Failed to change password');
    }
  },
  error: (error) => {
    this.toastr.error('An error occurred');
    console.error('Error changing password:', error);
  }
});

  }


  private validatePasswords(): boolean {
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

    if (this.passwordData.newPassword.length < 6) {
      this.toastr.error('Password must be at least 6 characters long');
      return false;
    }

    return true;
  }


}
