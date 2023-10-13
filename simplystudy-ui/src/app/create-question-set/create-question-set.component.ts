import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-create-question-set',
  standalone: true,
  templateUrl: './create-question-set.component.html',
  styleUrls: ['./create-question-set.component.css'],
  imports: [CommonModule, MatStepperModule, MatButtonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
})
export class CreateQuestionSetComponent {

  // TODO: Add course component and load it from api
  courseList: Array<any> = ["Example1", "Example2"];

  questionSetData = this._formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    course: [''],

  });

  constructor(private _formBuilder: FormBuilder) {

  }
}
