import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule, TranslateModule.forRoot()],
      declarations: [ConfirmationDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test Message' } },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
      ]
    });
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set message from MAT_DIALOG_DATA', () => {
    expect(component.message).toBe('Test Message');
  });

  it('should close dialog with true on onConfirm', () => {
    component.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false on onDismiss', () => {
    component.onDismiss();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
