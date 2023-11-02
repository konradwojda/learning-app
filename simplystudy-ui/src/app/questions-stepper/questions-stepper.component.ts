import { Component, forwardRef } from '@angular/core';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'cdk-custom-stepper-without-form-example',
  templateUrl: './cdk-custom-stepper-without-form-example.html',
  styleUrls: ['./cdk-custom-stepper-without-form-example.css'],
  standalone: true,
  imports: [forwardRef(() => QuestionsStepperComponent), CdkStepperModule, MatCardModule],
})
export class CdkCustomStepperWithoutFormExample { }

@Component({
  selector: 'app-questions-stepper',
  templateUrl: './questions-stepper.component.html',
  styleUrls: ['./questions-stepper.component.css'],
  providers: [{ provide: CdkStepper, useExisting: QuestionsStepperComponent }],
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule, NgFor, MatIconModule, MatButtonModule],
})
export class QuestionsStepperComponent extends CdkStepper {
  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
