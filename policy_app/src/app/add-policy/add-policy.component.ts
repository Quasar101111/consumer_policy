import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-policy',
  imports: [NavbarComponent,FormsModule,CommonModule],
  templateUrl: './add-policy.component.html',
  styleUrl: './add-policy.component.scss'
})
export class AddPolicyComponent {
  policyData = {
    policyNumber: '',
    chassisNumber: '',
    
  };
  result= '';
  errorMessage = '';
  username= '';
  submitted = false;
  constructor(private apiService : ApiService, private router: Router){}
 
  onSubmit() {
      this.result= '';
      this.errorMessage = '';
  if (this.policyData.policyNumber && this.policyData.chassisNumber) {
    console.log('Form submitted:', this.policyData);
    this.submitted = true;

    this.apiService.checkPolicy(this.policyData).subscribe({
      next: (response) => {
        if (response && response.vehicle && response.policy) { 
          console.log('Policy response:', response.vehicle, response.policy);
          
         
          
            this.result = `Policy and vehicle found:\n
            Vehicle Registration: ${response.vehicle.registrationNumber}
            Date of Purchase: ${response.vehicle.dateOfPurchase?.split('T')[0]}
            Ex-Showroom Price: ₹${response.vehicle.exShowroomPrice}
            Policy Effective Date: ${response.policy.policyEffectiveDate}
            Policy Expiration Date: ${response.policy.policyExpirationDate}
            Total Premium: ₹${response.policy.totalPremium}`;
         

   
        } 
        else if (response && response.message) {
          this.errorMessage = response.message;
          
        }
        
        else {
          alert('Unexpected response from the server.');
          
          console.error('Unexpected response:', response);
        }
      },
      error: (error) => {
        console.error('Error checking policy:', error);
        alert('An error occurred while checking the policy. Please try again.');
      }
    });
  } else {
    alert('Please fill in all required fields.');
  }
}

addPolicy() {
  
  this.username = localStorage.getItem('username') || '';
  console.log('Policy response:', this.policyData.policyNumber, this.username);
  this.apiService.addPolicy(this.policyData.policyNumber, this.username).subscribe({
    next: (response) => {
    if (response && response.message) {  
     if (response.message === 'Policy is added') {
          this.result = 'Policy added successfully!';
          this.errorMessage = '';
        } else if (response.message === 'Already Added') {
          this.errorMessage = 'This policy is already added to your account';
          this.result = '';
        } else {
          this.errorMessage = response.message;
          this.result = '';
        }
        console.log('Server response:', response);
      } else {
        this.errorMessage = 'Unexpected response from the server';
        console.error('Unexpected response:', response);
      }
    }
});
}



 
  

}
