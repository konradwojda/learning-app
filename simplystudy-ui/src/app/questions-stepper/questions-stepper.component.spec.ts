import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsStepperComponent } from './questions-stepper.component';

describe('QuestionsStepperComponent', () => {
  let component: QuestionsStepperComponent;
  let fixture: ComponentFixture<QuestionsStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionsStepperComponent]
    });
    fixture = TestBed.createComponent(QuestionsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
