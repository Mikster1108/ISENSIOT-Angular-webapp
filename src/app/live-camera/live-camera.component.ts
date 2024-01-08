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
  streamErrorMessage: string | undefined;

  paused: boolean = false;
  streamStarted: boolean = false;
  // streamTimeoutId: NodeJS.Timeout | undefined;

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
    this.statusMessage = 'Exiting stream...';
    this.streamStarted = false;
    this.statusMessage = undefined;
    this.disconnect();
  }

  togglePause(): void {
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

  initStream(): void {
    this.statusMessage = 'Waiting for server response...';
    this.socketService.startStream().subscribe(() => {
      this.streamStarted = true;
      this.statusMessage = 'Loading stream...'
    });
  }

  // private startObservingStreamResponse(): void {
  //   let lastValue = this.cameraFrameComponent.getFrameData();
  //
  //   this.streamTimeoutId = setInterval(() => {
  //     if (this.cameraFrameComponent.getFrameData() && this.cameraFrameComponent.getFrameData() === lastValue) {
  //       this.streamErrorMessage = 'Failed to load stream, if it does not show up after a while reload the page.'
  //     }
  //     else if (this.cameraFrameComponent.getFrameData()) {
  //       this.statusMessage = undefined;
  //     }
  //     else {
  //       lastValue = this.cameraFrameComponent.getFrameData();
  //     }
  //   }, 8000);
  // }
  //
  // private stopObservingFrameData()  {
  //   if (this.streamTimeoutId) {
  //     clearInterval(this.streamTimeoutId)
  //   }
  //   this.streamTimeoutId = undefined;
  // }

  handleStreamCrash(): void {
    this.streamErrorMessage = 'Connection to stream was broken!'
    this.streamStarted = false;
  }

}
