import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePolicyComponent } from './manage-policy.component';

describe('ManagePolicyComponent', () => {
  let component: ManagePolicyComponent;
  let fixture: ComponentFixture<ManagePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
