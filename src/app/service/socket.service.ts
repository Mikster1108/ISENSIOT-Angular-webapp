import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LivestreamSocket} from "../model/livestream-socket";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: LivestreamSocket) { }

  connect(): Observable<any> {
    this.socket.connect()

    return this.socket.fromEvent('connect_response');
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  startStream(): Observable<any> {
    this.socket.emit('start-stream');

    return this.socket.fromEvent('start_stream_response');
  }

  startRecording(): Observable<any> {
    this.socket.emit('start-recording');

    return this.listenForRecording();
  }

  listenForRecording(): Observable<any> {
    return this.socket.fromEvent('start_recording_response');
  }

  getFrame(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('frame', (data: any) => {
        observer.next(data);
      });
    });
  }
}
