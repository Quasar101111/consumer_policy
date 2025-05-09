import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-policy',
  imports: [NavbarComponent,FormsModule],
  templateUrl: './add-policy.component.html',
  styleUrl: './add-policy.component.scss'
})
export class AddPolicyComponent {
  policyData = {
    policyNumber: '',
    chassisNumber: '',
  };

  submitted = false;
  constructor(private apiService : ApiService, private router: Router){}
 
  onSubmit() {
  if (this.policyData.policyNumber && this.policyData.chassisNumber) {
    console.log('Form submitted:', this.policyData);
    this.submitted = true;

    this.apiService.checkPolicy(this.policyData).subscribe({
      next: (response) => {
        if (response && response.vehicle && response.policy) { // Access 'message' correctly
          console.log('Policy response:', response.vehicle, response.policy);
          
          alert(`Policy and vehicle found:\n
            Vehicle Registration: ${response.vehicle.registrationNumber}\n
            Policy Effective Date: ${response.policy.policyEffectiveDate}`);
   
        } 
        else if (response && response.message) {
          alert(response.message); // Display the message from the backend
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




 
  

}
