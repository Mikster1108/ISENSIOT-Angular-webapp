import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";
import {TokenStorageService} from "../service/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any  = {
    email: null,
    password: null
  }

  email: string | undefined;
  password: string | undefined;

  isLoggedIn: boolean = false;
  errorStatusCode: number | undefined;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;

      window.location.href="/home";
    }
  }

  onSubmit(): void {
    const {email, password} = this.form;

    this.authService.login(email, password).subscribe(
        (data: any) => {
          this.tokenStorage.saveToken(data.token);
          window.location.href = "/home";

        }, err => {
          this.isLoggedIn = false;
            this.errorStatusCode = err.status;
          }
    );
  }

  resetErrorStatusCode() {
    this.errorStatusCode = undefined;
    console.log(this.errorStatusCode)
  }

}
