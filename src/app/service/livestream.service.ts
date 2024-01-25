import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

const PATH = environment.apiUrl + '/livestream';

@Injectable({
  providedIn: 'root'
})
export class LivestreamService {

  constructor(private http: HttpClient) {
  }

  startStream(): Observable<any> {
    return this.http.get(`${PATH}/start-recording`);
  }

}

