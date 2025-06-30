import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { of, throwError } from 'rxjs';
import { ViewPolicyComponent } from './view-policy.component';

describe('ViewPolicyComponent', () => {
  let component: ViewPolicyComponent;
  let fixture: ComponentFixture<ViewPolicyComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['policyDetails', 'viewPolicyNumbers']);

    await TestBed.configureTestingModule({
      imports: [ViewPolicyComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPolicyComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {

    apiServiceSpy.viewPolicyNumbers.and.returnValue(of(['POL1', 'POL2']));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show error message if status 404 occurred', fakeAsync(() => {
    localStorage.setItem('username', 'test');
    const error = { status: 404, error: { Message: 'No policies found' } };

    apiServiceSpy.viewPolicyNumbers.and.returnValue(throwError(() => error));

    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.errorOccurred).toBeTrue();
    expect(component.errMsg).toBe('No policies found');
  }));

  it('should load policies and call getPolicyDetails if successful', fakeAsync(() => {
    const policyNumbers = ['POL123', 'POL456'];
    const policyDetailsMock = { policyNumber: 'POL123', amount: 1000 };

    apiServiceSpy.viewPolicyNumbers.and.returnValue(of(policyNumbers));
    apiServiceSpy.policyDetails.and.returnValue(of(policyDetailsMock));

    component.ngOnInit();
    tick();

    expect(component.errorOccurred).toBeFalse();
    expect(component.policies).toEqual(policyNumbers);
    expect(component.selectedPolicy).toBe('POL123');
    expect(component.policyDetails).toEqual(policyDetailsMock);
  }));

  it('should show error if no policy is selected in onPolicySelect', () => {


    component.selectedPolicy = '';
    component.onPolicySelect();

    expect(component.errorOccurred).toBeTrue();
    expect(component.errMsg).toBe('Please select a policy to view details.');
  });
});
