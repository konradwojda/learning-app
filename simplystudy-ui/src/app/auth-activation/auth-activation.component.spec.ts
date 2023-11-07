import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthActivationComponent } from './auth-activation.component';

describe('AuthActivationComponent', () => {
  let component: AuthActivationComponent;
  let fixture: ComponentFixture<AuthActivationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthActivationComponent],
    });
    fixture = TestBed.createComponent(AuthActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
