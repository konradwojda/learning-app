import { Component } from '@angular/core';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-questions-stepper',
  templateUrl: './questions-stepper.component.html',
  styleUrls: ['./questions-stepper.component.css'],
  providers: [{ provide: CdkStepper, useExisting: QuestionsStepperComponent }],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkStepperModule,
    NgFor,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class QuestionsStepperComponent extends CdkStepper {}
