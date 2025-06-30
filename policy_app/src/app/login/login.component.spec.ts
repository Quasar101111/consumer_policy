import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../services/api.service';
import { EventService } from '../services/event.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['login']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['sendWelcomeMessage']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: EventService, useValue: eventServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message on login failure', () => {
  
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.loginData = { username: 'wrong', password: 'wrong' };

        component.onLogin();

    expect(component.loginError).toBe('Invalid username or password.');
  });
});
