import { ComponentFixture, TestBed } from '@angular/core/testing';
import{Router} from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { fakeAsync, tick } from '@angular/core/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let routerSpy : jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router',['navigate']);
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers:[
              {provide: Router, useValue: routerSpy},
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit usernameChange with userName on ngOnInit', () => {
    spyOn(component.usernameChange, 'emit');
    component.ngOnInit();
    expect(component.usernameChange.emit).toHaveBeenCalledWith(component.userName);
  });

   it('should set userName from localStorage or default to Guest', () => {
    localStorage.setItem('username', 'TestUser');
    const testComponent = new NavbarComponent(routerSpy);
    expect(testComponent.userName).toBe('TestUser');

    localStorage.removeItem('username');
    const guestComponent = new NavbarComponent(routerSpy);
    expect(guestComponent.userName).toBe('Guest');
  });

  it('should clear username and token from localStorage and navigate to /login on logout', async () => {
    localStorage.setItem('username', 'TestUser');
    localStorage.setItem('token', 'TestToken');

    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    await component.logout();

    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(component.userName).toBe('');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
