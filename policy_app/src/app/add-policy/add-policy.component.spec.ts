import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '../services/api.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AddPolicyComponent } from './add-policy.component';

describe('AddPolicyComponent', () => {
  let component: AddPolicyComponent;
  let fixture: ComponentFixture<AddPolicyComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['checkPolicy', 'addPolicy']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [AddPolicyComponent],
      providers:[
        {provide: ApiService, useValue: apiServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ToastrService, useValue: toastrSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the policydetails when  valid policyno and chasisno ',fakeAsync(()=>{
     component.policyData = {
      policyNumber: 'PN123',
      chassisNumber: 'CH456'
    };
    const mockResponse = {
      vehicle: {
        registrationNumber: 'MH12AB1234',
        dateOfPurchase: '2023-01-01T00:00:00.000Z',
        exShowroomPrice: 500000
      },
      policy: {
        policyEffectiveDate: '2023-01-01',
        policyExpirationDate: '2024-01-01',
        totalPremium: 15000
      }
    };
    apiServiceSpy.checkPolicy.and.returnValue(of(mockResponse));
    toastrSpy.success = jasmine.createSpy('success');
    component.onSubmit();
    tick();
    expect(apiServiceSpy.checkPolicy).toHaveBeenCalledWith(component.policyData);
    expect(component.result).toContain('Policy and vehicle found');
    expect(toastrSpy.success).toHaveBeenCalled();
    expect(component.submitted).toBeTrue();
  }));

 

  it('should show warning when either no vehicle or policy', fakeAsync(() => {
    component.policyData = {
      policyNumber: 'PN123',
      chassisNumber: 'CH456'
    };
    const mockResponse = { message: 'Not found' };
    apiServiceSpy.checkPolicy.and.returnValue(of(mockResponse));
    toastrSpy.warning = jasmine.createSpy('warning');
    component.onSubmit();
    tick();
    expect(toastrSpy.warning).toHaveBeenCalledWith("Please make sure policy  and chassis number are correct", "Warning");
  }));

  it('should show error toastr and alert on unexpected response', fakeAsync(() => {
    component.policyData = {
      policyNumber: 'PN123',
      chassisNumber: 'CH456'
    };
    spyOn(window, 'alert');
    const mockResponse = {};
    apiServiceSpy.checkPolicy.and.returnValue(of(mockResponse));
    toastrSpy.error = jasmine.createSpy('error');
    component.onSubmit();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Unexpected response from the server.');
    expect(toastrSpy.error).toHaveBeenCalledWith('Unexpected response from the server.', "Error");
  }));

  it('should show alert on error from apiService.checkPolicy', fakeAsync(() => {
    component.policyData = {
      policyNumber: 'PN123',
      chassisNumber: 'CH456'
    };
    spyOn(window, 'alert');
    apiServiceSpy.checkPolicy.and.returnValue(throwError(() => new Error('API error')));
    component.onSubmit();
    tick();
    expect(window.alert).toHaveBeenCalledWith('An error occurred while checking the policy. Please try again.');
  }));

  it('should show alert if required fields are missing', () => {
    component.policyData = {
      policyNumber: '',
      chassisNumber: ''
    };
    spyOn(window, 'alert');
    component.onSubmit();
    toastrSpy.warning= jasmine.createSpy('Please fill all required fields');
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
  });

  it('should call addPolicy and navigate on "Policy is added"', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    component.policyData.policyNumber = 'PN123';
    const mockResponse = { message: 'Policy is added' };
    apiServiceSpy.addPolicy.and.returnValue(of(mockResponse));
    toastrSpy.success = jasmine.createSpy('success');
    component.addPolicy();
    tick();
    expect(apiServiceSpy.addPolicy).toHaveBeenCalledWith('PN123', 'testuser');
    expect(toastrSpy.success).toHaveBeenCalledWith("Policy added");
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/manage-policy']);
  }));

  it('should show warning and set errorMessage if policy is already added', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    component.policyData.policyNumber = 'PN123';
    const mockResponse = { message: 'Already Added' };
    apiServiceSpy.addPolicy.and.returnValue(of(mockResponse));
    toastrSpy.warning = jasmine.createSpy('warning');
    component.addPolicy();
    tick();
    expect(component.errorMessage).toBe('This policy is already added to your account');
    expect(toastrSpy.warning).toHaveBeenCalledWith("Policy is already added");
    expect(component.result).toBe('');
  }));

  it('should set errorMessage on unexpected addPolicy response', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    component.policyData.policyNumber = 'PN123';
    const mockResponse = { message: 'Some other message' };
    apiServiceSpy.addPolicy.and.returnValue(of(mockResponse));
    component.addPolicy();
    tick();
    expect(component.errorMessage).toBe('Unexpected response from the server');
  }));

  it('should set errorMessage on addPolicy response without message', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    component.policyData.policyNumber = 'PN123';
    const mockResponse = {};
    apiServiceSpy.addPolicy.and.returnValue(of(mockResponse));
    component.addPolicy();
    tick();
    expect(component.errorMessage).toBe('Unexpected response from the server');
  }));

});
