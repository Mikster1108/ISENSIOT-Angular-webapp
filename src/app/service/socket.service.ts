import { Socket } from 'ngx-socket-io';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  connect() {
    this.socket.connect();

    return this.socket.fromEvent('response');
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

  startStream(): void {
    this.socket.emit('start-stream');
  }

  stopStream(): void {
    this.socket.emit('stop-stream');
  }

  getFrame(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('frame', (data: any) => {
        observer.next(data);
      });
    });
  }
}
