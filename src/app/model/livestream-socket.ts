import {environment} from "../../environments/environment";
import {Socket} from "ngx-socket-io";
import {TokenStorageService} from "../service/token.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class LivestreamSocket extends Socket {

  token: string | undefined;

  constructor(private tokenStorage: TokenStorageService) {

    super({
      url: environment.apiUrl,
      options: {
        autoConnect: false,
        transports: ['websocket'],
        reconnection: false
      }});
    let token = this.tokenStorage.getToken();
    this.ioSocket.io.uri += `?token=${token}`

  }
}
