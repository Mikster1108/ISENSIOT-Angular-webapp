import { Socket } from 'ngx-socket-io';
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  connect() {
    this.socket.connect();

    return this.socket.fromEvent('message');
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  onMessage(): any {
    return this.socket.fromEvent('response');
  }
}
