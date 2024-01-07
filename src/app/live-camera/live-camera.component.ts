import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-live-camera',
  templateUrl: './live-camera.component.html',
})
export class LiveCameraComponent implements OnInit, OnDestroy {

  responseMessage: string | undefined;
  streamStarted: boolean = false;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
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
  }

  startWatchingStream(): void {
    this.connect().subscribe(() => {
      this.initStream();
    });
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
    this.socketService.startStream().subscribe(() => {
      this.responseMessage = 'Loading stream...'
    });
  }

  handleStreamCrash(): void {
    this.responseMessage = 'Connection to stream was broken!'
    this.streamStarted = false;
  }

}
