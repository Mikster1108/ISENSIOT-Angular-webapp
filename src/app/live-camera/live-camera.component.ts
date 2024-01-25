import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Observable} from "rxjs";
import {CameraFrameComponent} from "./camera-frame/camera-frame.component";
import {LivestreamService} from "../service/livestream.service";

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
  recording: boolean = false;
  streamActive: boolean = false;

  serverResponseTimeout: NodeJS.Timeout | undefined;

  constructor(private socketService: SocketService, private livestreamService: LivestreamService) { }

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
      this.waitForServerResponse(this.streamActive);
      this.setStatusMessage('Waiting for server response...');
      this.connect().subscribe(() => {
        this.initStream();
      });
    }
  }

  stopWatchingStream(): void {
    this.streamActive = false;
    this.setStatusMessage(undefined);
    this.clearWaitForServerResponse();
    this.disconnect();
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
          this.setStatusMessage(undefined);
        } else {
          attempts++;
        }
        if (attempts >= max_tries) {
          this.setErrorMessage('Server response timed out, try again later');
        }
      }, interval_ms);
    });
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
        this.setStatusMessage(undefined);
      }
    }
  }

  startRecording(): void {
    if (!this.serverResponseTimeout) {
      this.setStatusMessage('Pausing stream and waiting for response...');
      this.waitForServerResponse(this.recording);
      this.togglePause();

      this.livestreamService.startStream().subscribe((response: any) => {
        this.togglePause();
        this.clearWaitForServerResponse();
        this.setStatusMessage(response['success']);
        this.recording = true;
      }, error => {
        this.togglePause();
        this.recording = false;
        if (this.serverResponseTimeout) {
          this.setErrorMessage(error.error.error);
        }
        this.clearWaitForServerResponse();
      });
    }
  }

  waitForServerResponse(condition: boolean): void {
    this.serverResponseTimeout = setInterval(() => {
      if (!condition) {
        this.setErrorMessage('Response timed out, try again later')
        this.clearWaitForServerResponse();
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
    this.streamActive = false;
    this.clearWaitForServerResponse();
  }

  setStatusMessage(message: string | undefined): void {
    this.errorMessage = undefined;
    this.statusMessage = message;
  }

  setErrorMessage(message: string | undefined) {
    this.statusMessage = undefined;
    this.errorMessage = message;
  }


}
