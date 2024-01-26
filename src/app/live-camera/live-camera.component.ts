import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../service/socket.service";
import {Observable, Subscription} from "rxjs";
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
  recording: boolean = false;
  streamActive: boolean = false;

  serverResponseTimeout: NodeJS.Timeout | undefined;
  recordingResponseTimeout: NodeJS.Timeout | undefined;
  recordingObservable: Subscription | undefined;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.connect();
    setInterval(() => {
      const checkRecordingOnLoadPageObservable = this.socketService.listenForRecording().subscribe(() => {
        this.observeRecording();
        checkRecordingOnLoadPageObservable.unsubscribe();
      });
    }, 3000);

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
      this.connect();
      this.initStream();
    }
  }

  stopWatchingStream(): void {
    this.streamActive = false;
    this.clearWaitForServerResponse();
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
          this.setStatusMessage(undefined);
          this.clearWaitForServerResponse();
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
      }
    }
  }

  startRecording(): void {
    this.connect();

    if (!this.recordingResponseTimeout) {
      this.setStatusMessage('Pausing stream and waiting for response...');
      this.waitForRecordingResponse();
      this.togglePause();

      // start recording also listens for response, unsubscribe after first response
      const startRecordingObservable = this.socketService.startRecording().subscribe((response: any) => {
        this.togglePause();
        this.clearRecordingResponse();
        this.setStatusMessage('Parsing response...')

        if (response['data']) {
          this.recording = true;
          this.setStatusMessage(response['data']);
          startRecordingObservable.unsubscribe();
        }

        else {
          this.recording = false;
          this.setErrorMessage(response['error']);
          startRecordingObservable.unsubscribe();
        }
      })
    }
  }

  observeRecording(): void {

    if (this.recordingObservable) {
      return
    }

    this.recordingObservable = this.socketService.listenForRecording().subscribe((response: any) => {
      if (response['data']) {
        this.recording = true;
        if (!this.serverResponseTimeout) {
          this.setStatusMessage(response['data']);
        }
      }

      else {
        this.recording = false;
        this.setStatusMessage(undefined);
      }
    });
  }

  waitForServerResponse(condition: boolean): void {
    this.serverResponseTimeout = setInterval(() => {
      if (!condition) {
        this.setErrorMessage('Response timed out, try again later')
        this.clearWaitForServerResponse();
      }
    }, SERVER_TIMEOUT_RESPONSE_MS);
  }

  waitForRecordingResponse(): void {
    this.recordingResponseTimeout = setInterval(() => {
      if (!this.recording) {
        this.setErrorMessage('Failed to start recording, try again later')
        this.clearRecordingResponse();
        this.togglePause();
      }
    }, SERVER_TIMEOUT_RESPONSE_MS);
  }

  clearRecordingResponse(): void {
    clearInterval(this.recordingResponseTimeout);
    this.recordingResponseTimeout = undefined;
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
