import { Socket } from 'ngx-socket-io';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  connect(): Observable<any> {
    this.socket.connect();

    return this.socket.fromEvent('connect_response');
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  startStream(): Observable<any> {
    this.socket.emit('start-stream');

    return this.socket.fromEvent('start_stream_response');
  }

  getFrame(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('frame', (data: any) => {
        observer.next(data);
      });
    });
  }
}
