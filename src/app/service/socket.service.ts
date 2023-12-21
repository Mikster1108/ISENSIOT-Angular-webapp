import { Socket } from 'ngx-socket-io';
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  connectToNamespace(namespace: string): void {
    this.socket.ioSocket.io.uri = `${this.socket.ioSocket.io.uri}${namespace}`;
    this.socket.connect();
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
