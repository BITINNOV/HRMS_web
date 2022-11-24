import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginOrganizationComponent} from './login-organization.component';

describe('LoginOrganizationComponent', () => {
  let component: LoginOrganizationComponent;
  let fixture: ComponentFixture<LoginOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginOrganizationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
