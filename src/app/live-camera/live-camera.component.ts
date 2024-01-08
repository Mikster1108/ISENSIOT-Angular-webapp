import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Observable} from "rxjs";
import {CameraFrameComponent} from "./camera-frame/camera-frame.component";

@Component({
  selector: 'app-live-camera',
  templateUrl: './live-camera.component.html',
})
export class LiveCameraComponent implements OnInit, OnDestroy {

  @ViewChild(CameraFrameComponent) cameraFrameComponent!: CameraFrameComponent;

  statusMessage: string | undefined;
  errorMessage: string | undefined;

  paused: boolean = false;
  streamActive: boolean = false;

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
    this.streamActive = false;
  }

  startWatchingStream(): void {
    this.connect().subscribe(() => {
      this.initStream();
    });
  }

  stopWatchingStream(): void {
    this.setStatusMessage('Exiting stream...');
    this.streamActive = false;
    this.setStatusMessage('');
    this.disconnect();
  }

  togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.cameraFrameComponent.pauseFrameData();
      this.cameraFrameComponent.stopObservingFrameData();
      this.setStatusMessage('Stream paused');
    }
    else if (!this.paused) {
      this.cameraFrameComponent.watchFrameData();
      this.cameraFrameComponent.startObservingFrameData();
      this.setStatusMessage('');
    }
  }

  initStream(): void {
    this.setStatusMessage('Waiting for server response...');
    this.socketService.startStream().subscribe(() => {
      this.setStatusMessage('Request received, starting stream...');
      this.streamActive = true;
    });
  }

  receiveStreamStatusMessage(message: string): void {
    this.setStatusMessage(message);
  }

  receiveStreamErrorMessage(message: string): void {
    this.setErrorMessage(message);
  }

  setStatusMessage(message: string): void {
    this.errorMessage = ''
    this.statusMessage = message;
    this.streamActive = true;
  }

  setErrorMessage(message: string) {
    this.statusMessage = '';
    this.errorMessage = message;
    this.streamActive = false;
  }


}
