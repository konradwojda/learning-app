import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPreviewComponent } from './test-preview.component';

describe('TestPreviewComponent', () => {
  let component: TestPreviewComponent;
  let fixture: ComponentFixture<TestPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestPreviewComponent]
    });
    fixture = TestBed.createComponent(TestPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
