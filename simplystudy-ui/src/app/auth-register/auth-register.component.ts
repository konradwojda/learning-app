import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { RegisterUserData } from "../auth";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule]
})
export class AuthRegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      re_password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  registerUser(user: RegisterUserData): void {
    this.authService.registerUser(user.username, user.password, user.re_password, user.email).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    }
    );;
  }

  onSubmit(formData: RegisterUserData): void {
    if (this.registerForm.invalid) {
      console.log(this.registerForm.errors);
    } else {
      this.registerUser(formData);
    }
  }
}
