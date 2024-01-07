import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-live-camera',
  templateUrl: './live-camera.component.html',
})
export class LiveCameraComponent implements OnInit, OnDestroy {

  connected: boolean = false
  responseMessage: string | undefined;
  streamStarted: boolean = false;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.connect().subscribe(() => {}, error => {
      this.responseMessage = 'Connection to server failed!';
      this.connected = true;
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  connect(): Observable<any> {
    return this.socketService.connect();
  }

  disconnect(): void {
    this.socketService.disconnect();
    this.streamStarted = false;
    this.connected = false;
  }

  startWatchingStream(): void {
    this.initStream();
  }

  stopWatchingStream(): void {
    this.responseMessage = 'Exiting stream...';
    this.streamStarted = false;
    this.responseMessage = undefined;
    this.disconnect();
  }

  initStream(): void {
    this.responseMessage = 'Waiting for server response...';
    this.streamStarted = true;
    this.socketService.startStream().subscribe((response: any) => {
          if (response.data) {
            this.responseMessage = 'Loading stream...'
          }
        }, error => {
          this.streamStarted = false;
          this.responseMessage = 'Failed to fetch the stream!'
        }
    );
  }

  handleStreamCrash(): void {
    this.responseMessage = 'Connection to stream was broken!'
    this.streamStarted = false;
  }

}
