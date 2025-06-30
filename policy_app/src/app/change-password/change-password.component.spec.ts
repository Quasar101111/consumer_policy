import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '../services/api.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ChangePasswordComponent } from './change-password.component';




describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;





  beforeEach(async () => {

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['changePassword']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'info','success']);

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers:[
        {provide: ApiService, useValue: apiServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ToastrService, useValue: toastrSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


    afterEach(async() => {
  // @ts-ignore - currentTest is internal Jasmine state
  const testName = jasmine["currentTest"]?.fullName;
  // @ts-ignore
  const passed = jasmine["currentTest"]?.status === 'passed';

  if (testName) {
    console.log(`Test "${testName}": ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  }
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login when Username not found ',fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('');
       
       spyOn(component, 'validatePasswords').and.returnValue(true);
      component.onSubmit();
       tick();
      expect(toastrSpy.error).toHaveBeenCalledWith('Please log in again');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    
  }));

 it('should show warning when the required fields are not filled', () => {
  component.passwordData.oldPassword = '';
  component.passwordData.newPassword = '';
  component.passwordData.confirmPassword = '';

  const result = component.validatePasswords();
  expect(result).toBeFalse();
});


   it('should show error if new passwords do not match', () => {
    component.passwordData.oldPassword = 'old';
    component.passwordData.newPassword = 'newpass';
    component.passwordData.confirmPassword = 'different';
   
    const result = component.validatePasswords();
    expect(toastrSpy.error).toHaveBeenCalledWith('New passwords do not match');
    expect(result).toBeFalse();
  });

   it('should show error if new password is too short', () => {
    component.passwordData.oldPassword = 'old';
    component.passwordData.newPassword = '123';
    component.passwordData.confirmPassword = '123';
    
    const result = component.validatePasswords();
    expect(toastrSpy.error).toHaveBeenCalledWith('Password must be at least 6 characters long');
    expect(result).toBeFalse();
  });

  it('should call validatePasswords onSubmit', () => {
    spyOn(component, 'validatePasswords').and.returnValue(false);
    component.onSubmit();
    expect(component.validatePasswords).toHaveBeenCalled();
  });

  
  it('should return true if all validations pass', () => {
    component.passwordData.oldPassword = 'old';
    component.passwordData.newPassword = '123456';
    component.passwordData.confirmPassword = '123456';
    const result = component.validatePasswords();
    expect(result).toBeTrue();
  });

 

  it('should changePassword on success response', () => {
    spyOn(component, 'validatePasswords').and.returnValue(true);
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    const response = { message: 'Password changed successfully.' };
    apiServiceSpy.changePassword.and.returnValue(of(response));
   
    component.passwordData.oldPassword = 'old';
    component.passwordData.newPassword = 'newpass';
    component.passwordData.confirmPassword = 'newpass';
    component.onSubmit();
    expect(apiServiceSpy.changePassword).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith(response.message);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error if current password is wrong',fakeAsync( () => {
    spyOn(component, 'validatePasswords').and.returnValue(true);
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    apiServiceSpy.changePassword.and.returnValue(throwError({ status: 400 }));
   
    component.passwordData.oldPassword = 'old';
    component.passwordData.newPassword = 'newpass';
    component.passwordData.confirmPassword = 'newpass';
    component.onSubmit();
    expect(toastrSpy.error).toHaveBeenCalledWith('Current password may be incorrect');
  }));

 
  it('should show message for unknown error', () => {
    spyOn(component, 'validatePasswords').and.returnValue(true);
    spyOn(localStorage, 'getItem').and.returnValue('testuser');
    apiServiceSpy.changePassword.and.returnValue(throwError(() => ({})));

   
    component.passwordData.oldPassword = 'old';
    component.passwordData.newPassword = 'newpass';
    component.passwordData.confirmPassword = 'newpass';
    component.onSubmit();
    expect(toastrSpy.error).toHaveBeenCalledWith('Password change failed. Please try again.');
  });

});
