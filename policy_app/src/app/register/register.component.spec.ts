import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing'; 



  describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
      apiServiceSpy = jasmine.createSpyObj('ApiService', ['checkUsername', 'register']);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        imports: [RegisterComponent],
        providers: [
          { provide: ApiService, useValue: apiServiceSpy },
          { provide: Router, useValue: routerSpy }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set usernameTaken to false if username is available', () => {
      component.registerData.username = 'testuser';
      apiServiceSpy.checkUsername.and.returnValue(of({}));
      component.checkUsername();
      expect(apiServiceSpy.checkUsername).toHaveBeenCalledWith('testuser');
      expect(component.usernameTaken).toBeFalse();
    });

    it('should set usernameTaken to true if username is taken (409)', () => {
      component.registerData.username = 'takenuser';
      apiServiceSpy.checkUsername.and.returnValue(throwError({ status: 409 }));
      component.checkUsername();
      expect(component.usernameTaken).toBeTrue();
    });

    it('should set usernameTaken to false if username is empty', () => {
      component.registerData.username = '';
      component.usernameTaken = true;
      component.checkUsername();
      expect(component.usernameTaken).toBeFalse();
    });

    it('should set passwordMismatch to true if passwords do not match', () => {
      component.registerData.password = 'pass1';
      component.registerData.confirmPassword = 'pass2';
      component.checkPasswordMatch();
      expect(component.passwordMismatch).toBeTrue();
    });

    it('should set passwordMismatch to false if passwords match', () => {
      component.registerData.password = 'pass';
      component.registerData.confirmPassword = 'pass';
      component.checkPasswordMatch();
      expect(component.passwordMismatch).toBeFalse();
    });

    it('should not call register if passwordMismatch or usernameTaken is true', () => {
      
      spyOn(component,'checkUsername').and.callFake(()=> { });
      spyOn(component,'checkPasswordMatch').and.callFake(()=>{});
      component.passwordMismatch = true;
      component.usernameTaken = false;
      
      component.onRegister();
      expect(apiServiceSpy.register).not.toHaveBeenCalled();

      component.passwordMismatch = false;
      component.usernameTaken = true;
      component.onRegister();
      expect(apiServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should call register and navigate on successful registration', fakeAsync(() => {
      component.registerData = {
        username: 'user',
        fullName: 'User Name',
        password: 'pass',
        confirmPassword: 'pass',
        email: 'user@example.com'
      };
      spyOn(component, 'checkUsername').and.callFake(() => { component.usernameTaken = false; });
      spyOn(component, 'checkPasswordMatch').and.callFake(() => { component.passwordMismatch = false; });
      apiServiceSpy.register.and.returnValue(of({}));

      component.onRegister();
      expect(apiServiceSpy.register).toHaveBeenCalled();
      expect(component.successMessage).toBeTrue();
      tick(4000);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should set errorMessage on registration failure', () => {
      component.registerData = {
        username: 'user',
        fullName: 'User Name',
        password: 'pass',
        confirmPassword: 'pass',
        email: 'user@example.com'
      };
      spyOn(component, 'checkUsername').and.callFake(() => { component.usernameTaken = false; });
      spyOn(component, 'checkPasswordMatch').and.callFake(() => { component.passwordMismatch = false; });
      apiServiceSpy.register.and.returnValue(throwError({ status: 500 }));

      component.onRegister();
      expect(component.errorMessage).toBe('Registration failed. Please try again.');
    });

});


