import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HomeComponent } from './home.component';
import { EventService } from '../services/event.service';
import { BehaviorSubject, of } from 'rxjs';
import { Component } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let eventServiceSpy: Partial<EventService>;
  const mockEventSubject = new BehaviorSubject<number>(0);
  beforeEach(async () => {

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['viewPolicyNumbers', 'totalPremium']);
    eventServiceSpy = jasmine.createSpyObj('EventService', ['sendWelcomeMessage']);
    eventServiceSpy.welMsgs = mockEventSubject.asObservable();

    apiServiceSpy.viewPolicyNumbers.and.returnValue(of(['pol123', 'pol456']));
    apiServiceSpy.totalPremium.and.returnValue(of(20000));
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: EventService, useValue: eventServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome modal ', () => {
    localStorage.setItem('username', 'test');
    component['modal'] = { show: jasmine.createSpy('show') };
    
    component.msg = 1;
    component.onUsernameChange('test');
    expect(component['modal'].show).toHaveBeenCalled();
    expect(eventServiceSpy.sendWelcomeMessage).toHaveBeenCalledWith(0);
  });

  it('should not show modal  msg is not 1', () => {
    component['modal'] = { show: jasmine.createSpy('show') };
    component.msg = 0;
    component.onUsernameChange('Guest');
    expect(component['modal'].show).not.toHaveBeenCalled();
  });

  
  it('should fetch username and call API methods on init',fakeAsync( () => {
    expect(component.username).toBe('test');
    tick();
    expect(apiServiceSpy.viewPolicyNumbers).toHaveBeenCalledWith('test');
    expect(apiServiceSpy.totalPremium).toHaveBeenCalledWith('test');
    expect(component.policy.length).toBe(2);
    expect(component.totalPremiumvar).toBe(20000);
  }));
});
