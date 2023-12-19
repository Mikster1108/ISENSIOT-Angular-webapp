import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";
import {TokenStorageService} from "../service/token.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {
    email: '',
    password: '',
    access_code: null
  }

  isSuccessful: boolean | undefined;
  errorStatusCode: number | undefined;
  errorMessage: string | undefined;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      window.location.href="/home";
    }
  }

  onSubmit(): void {
    const {email, password, access_code} = this.form;

    this.authService.register(email, password, access_code).subscribe(
        (registerData: any) => {
          this.isSuccessful = true;
          this.tokenStorage.saveToken(registerData.token)

          window.location.href="/home";
        },
        err => {
          this.isSuccessful = false;
          this.errorStatusCode = err.status;
          this.errorMessage = err.error.error;

          if (!this.errorStatusCode) {
            this.errorStatusCode = 0;
          }
        }
    );
  }

  resetErrorVariables(): void {
    this.isSuccessful = undefined;
    this.errorStatusCode = undefined;
    this.errorMessage = undefined;
  }

}
