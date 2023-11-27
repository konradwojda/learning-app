import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [MatStepperModule, MatIconModule, TranslateModule],
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class TutorialComponent {

}
