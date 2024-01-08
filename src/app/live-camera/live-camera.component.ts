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

  serverResponseTimeout: NodeJS.Timeout | undefined;

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
    this.setStatusMessage('Waiting for server response...');
    this.connect().subscribe(() => {
      this.initStream();
    });

    this.serverResponseTimeout = setInterval(() => {
      if (!this.streamActive) {
        this.setErrorMessage('Failed to load stream, try again later')
      }
    }, 12000);
  }

  stopWatchingStream(): void {
    this.setStatusMessage('Exiting stream...');
    this.streamActive = false;
    this.setStatusMessage('');
    this.disconnect();
  }

  togglePause(): void {
    if (this.streamActive) {
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
  }

  initStream(): void {
    this.socketService.startStream().subscribe(() => {
      this.setStatusMessage('Request received, starting stream...');
      this.streamActive = true;
      clearInterval(this.serverResponseTimeout);
    });
  }

  receiveStreamStatusMessage(message: string): void {
    this.setStatusMessage(message);
  }

  receiveStreamErrorMessage(message: string): void {
    this.setErrorMessage(message);
  }

  setStatusMessage(message: string): void {
    this.errorMessage = undefined;
    this.statusMessage = message;
  }

  setErrorMessage(message: string) {
    this.statusMessage = undefined;
    this.errorMessage = message;
    this.streamActive = false;

    if (this.errorMessage) {
      clearInterval(this.serverResponseTimeout);
    }
  }


}
