import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';
import { ManagePolicyComponent } from './manage-policy.component';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';

describe('ManagePolicyComponent', () => {
  let component: ManagePolicyComponent;
  let fixture: ComponentFixture<ManagePolicyComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let modalServiceSpy: jasmine.SpyObj<BsModalService>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['viewPolicyNumbersWithStatus', 'deletePolicy', 'toggleStatus']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'info']);
    modalServiceSpy = jasmine.createSpyObj('BsModalService', ['show']);

    spyOn(localStorage, 'getItem').and.returnValue('testuser'); 
  apiServiceSpy.viewPolicyNumbersWithStatus.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [ManagePolicyComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: BsModalService, useValue: modalServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should set policies and selectedPolicy on successful API response', fakeAsync(() => {
    const mockPolicies = [
      { policyId: 1, policyNumber: 'PN001', status: 'Active' },
      { policyId: 2, policyNumber: 'PN002', status: 'Inactive' }
    ];
    
    apiServiceSpy.viewPolicyNumbersWithStatus.and.returnValue(of(mockPolicies));

    component.ngOnInit();
    tick();

    expect(component.policies.length).toBe(2);
    expect(component.selectedPolicy).toBe('PN001');
    expect(component.errorOccurred).toBeFalse();
  }));

  it('should handle 404 error and set errMsg', fakeAsync(() => {
    
    const error = { status: 404, error: { Message: 'No policies found' } };
    apiServiceSpy.viewPolicyNumbersWithStatus.and.returnValue(throwError(() => error));

    component.ngOnInit();
    tick();

    expect(component.errorOccurred).toBeTrue();
    expect(component.errMsg).toBe('No policies found');
  }));

  it('should handle non-404 error and set generic errMsg', fakeAsync(() => {
    
    const error = { status: 500, error: {} };
    apiServiceSpy.viewPolicyNumbersWithStatus.and.returnValue(throwError(() => error));

    component.ngOnInit();
    tick();

    expect(component.errorOccurred).toBeTrue();
    expect(component.errMsg).toBe('An unexpected error occurred');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  it('should navigate to add-policy on addPolicy()', () => {
    component.addPolicy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/add-policy']);
  });

  it('should call deletePolicy and remove policy on success', fakeAsync(() => {
    component.policies = [
      { policyId: 1, policyNumber: 'PN001', status: 'Active' },
      { policyId: 2, policyNumber: 'PN002', status: 'Inactive' }
    ];
    component.policyToDeleteIndex = 0;
    component.modalRef = { hide: jasmine.createSpy('hide') } as any;
    apiServiceSpy.deletePolicy.and.returnValue(of({}));

    component.deletePolicy();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('PN001  is deleted');
    expect(component.policies.length).toBe(1);
    expect(component.policyToDeleteIndex).toBeNull();
    expect((component.modalRef as any).hide).toHaveBeenCalled();
  }));

  it('should show error toast if deletePolicy fails', fakeAsync(() => {
    component.policies = [
      { policyId: 1, policyNumber: 'PN001', status: 'Active' }
    ];
    component.policyToDeleteIndex = 0;
    component.modalRef = { hide: jasmine.createSpy('hide') } as any;
    apiServiceSpy.deletePolicy.and.returnValue(throwError(() => ({})));

    component.deletePolicy();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to delete policy.');
    expect((component.modalRef as any).hide).toHaveBeenCalled();
  }));

  it('should set policyToDeleteIndex and show modal on confirmDeletePolicy', () => {
    const template = {} as any;
    modalServiceSpy.show.and.returnValue({} as any);

    component.confirmDeletePolicy(template, 1);

    expect(component.policyToDeleteIndex).toBe(1);
    expect(modalServiceSpy.show).toHaveBeenCalledWith(template, { class: 'modal-sm' });
  });

  it('should reset policyToDeleteIndex and hide modal on decline', () => {
    component.policyToDeleteIndex = 2;
    component.modalRef = { hide: jasmine.createSpy('hide') } as any;

    component.decline();

    expect(component.policyToDeleteIndex).toBeNull();
    expect((component.modalRef as any).hide).toHaveBeenCalled();
  });

  it('should toggle policy status and call API', fakeAsync(() => {
    component.policies = [
      { policyId: 1, policyNumber: 'PN001', status: 'Active' }
    ];
    apiServiceSpy.toggleStatus.and.returnValue(of({}));

    component.togglePolicy(0);
    tick();

    expect(component.policies[0].status).toBe('Inactive');
    expect(toastrSpy.info).toHaveBeenCalledWith('PN001 is now Inactive');
    expect(apiServiceSpy.toggleStatus).toHaveBeenCalledWith(1);
  }));

});