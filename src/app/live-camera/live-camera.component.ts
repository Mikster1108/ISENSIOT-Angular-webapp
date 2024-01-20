import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Observable} from "rxjs";
import {CameraFrameComponent} from "./camera-frame/camera-frame.component";

const SERVER_TIMEOUT_RESPONSE_MS = 15000

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

  ngOnDestroy(): void {
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
    if (!this.serverResponseTimeout) {
      this.waitForServerResponse();
      this.setStatusMessage('Waiting for server response...');
      this.connect().subscribe(() => {
        this.initStream();
      });
    }
  }

  stopWatchingStream(): void {
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
      this.clearWaitForServerResponse();

      const interval_ms = 500;
      const max_tries = SERVER_TIMEOUT_RESPONSE_MS / interval_ms;
      let attempts = 0;
      this.serverResponseTimeout = setInterval(() => {
        if (this.cameraFrameComponent && this.cameraFrameComponent._frameData) {
          this.streamActive = true;
          this.clearWaitForServerResponse();
          this.setStatusMessage('');
        } else {
          attempts++;
        }
        if (attempts >= max_tries) {
          this.setErrorMessage('Server response timed out, try again later');
        }
      }, interval_ms);
    });
  }

  waitForServerResponse(): void {
    this.serverResponseTimeout = setInterval(() => {
      if (!this.streamActive) {
        this.setErrorMessage('Failed to load stream, try again later')
      }
    }, SERVER_TIMEOUT_RESPONSE_MS);
  }

  clearWaitForServerResponse(): void {
    clearInterval(this.serverResponseTimeout);
    this.serverResponseTimeout = undefined;
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
      this.clearWaitForServerResponse();
    }
    this.disconnect();
  }


}
