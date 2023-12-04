import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.prod";

const path = environment.apiUrl + '/user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  //still needs to send user data with it
  registerUser() {
    return this.http.post(path + "/register", {params: {order: 'asc'}});
  }

  //still needs to send user data with it
  loginUser() {
    return this.http.post(path + "/login", {params: {order: 'asc'}});
  }
}
