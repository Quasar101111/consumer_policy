import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';



interface Policy {
  policyNumber: string;
  enabled: boolean;
}

@Component({
  selector: 'app-manage-policy',
  
  imports: [FormsModule,CommonModule],
  templateUrl: './manage-policy.component.html',
  styleUrls: ['./manage-policy.component.scss']
})
export class ManagePolicyComponent {
  policies: { policyNumber: string; status: string }[] = [];
  selectedPolicy: string = '';
  errorOccurred = false;
  errMsg = '';
  username = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';

    this.apiService.viewPolicyNumbersWithStatus(this.username).subscribe({
      next: (response) => {
        console.log('API response:', response);

        if (Array.isArray(response)) {
          this.policies = response.map(p => ({
            policyNumber: p.policyNumber,
            status: p.status
          }));
          this.selectedPolicy = this.policies[0]?.policyNumber || '';
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.errorOccurred = true;

        if (err.status === 404) {
          const errorMessage = err.error?.Message || 'No policies found';
          this.errMsg = errorMessage;
        } else {
          this.errMsg = 'An unexpected error occurred';
        }
      }
    });
  }

  deletePolicy(index: number) {
    this.policies.splice(index, 1);
  }

  togglePolicy(index: number) {
    const currentStatus = this.policies[index].status;
    this.policies[index].status = currentStatus === 'Active' ? 'Inactive' : 'Active';
  }
}
