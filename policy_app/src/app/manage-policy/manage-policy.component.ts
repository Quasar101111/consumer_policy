import { CommonModule } from '@angular/common';
import { Component, viewChild ,TemplateRef} from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';


interface Policy {
  policyNumber: string;
  enabled: boolean;
}

@Component({
  selector: 'app-manage-policy',
  
  imports: [FormsModule,CommonModule,NavbarComponent],
  templateUrl: './manage-policy.component.html',
  styleUrls: ['./manage-policy.component.scss']
})
export class ManagePolicyComponent {
  policies: { policyId: number ;policyNumber: string; status: string }[] = [];
  selectedPolicy: string = '';
  errorOccurred = false;
  errMsg = '';
  username = '';
   modalRef?: BsModalRef;
  policyToDeleteIndex: number | null = null;




  constructor(private apiService: ApiService, private toastr: ToastrService, private router : Router,
    private modalService : BsModalService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';

    this.apiService.viewPolicyNumbersWithStatus(this.username).subscribe({
      next: (response) => {
        console.log('API response:', response);

        if (Array.isArray(response)) {
          this.policies = response.map(p => ({
            policyId : p.policyId,
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

  addPolicy(){
    this.router.navigate(['/add-policy']);
  }
  confirmDeletePolicy(template: TemplateRef<any>, index: number) {
    this.policyToDeleteIndex = index;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  deletePolicy(): void {
    if (this.policyToDeleteIndex !== null) {
      var pos = this.policyToDeleteIndex;
      this.apiService.deletePolicy(this.policies[this.policyToDeleteIndex].policyId).subscribe({
        next: (response) => {
          console.log(`Policy with ID ${this.policies[pos].policyId} deleted successfully.`);
          this.toastr.error(`${this.policies[pos].policyNumber}  is deleted`);
          this.policies.splice(this.policyToDeleteIndex!, 1);
          this.policyToDeleteIndex = null;
          this.modalRef?.hide();
        },
        error: (err) => {
          console.error('Error deleting policy:', err);
          this.toastr.error('Failed to delete policy.');
          this.modalRef?.hide();
        }
      });
    }
  }

  decline(){
    this.policyToDeleteIndex = null;
    this.modalRef?.hide();
  }

  togglePolicy(index: number) {
    const currentStatus = this.policies[index].status;
    const policyNo = this.policies[index].policyNumber;
    console.log(this.policies[index].policyId);
    
    
    this.policies[index].status = currentStatus === 'Active' ? 'Inactive' : 'Active';
    this.toastr.info(`${policyNo} is now ${this.policies[index].status}`);
    
    this.apiService.toggleStatus(this.policies[index].policyId).subscribe({
      next:(response)=>{
        console.log(this.policies[index].policyId);
        
      }
    });
  }
}
