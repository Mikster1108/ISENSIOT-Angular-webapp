import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const BASE_PATH = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post(BASE_PATH + '/user/login', {
      email,
      password
    }, httpOptions);
  }

  register(email: string, password: string, accessCode: string) {
    return this.http.post(BASE_PATH + '/user/register', {
      email,
      password: password,
      access_code: accessCode
    }, httpOptions);
  }

}
