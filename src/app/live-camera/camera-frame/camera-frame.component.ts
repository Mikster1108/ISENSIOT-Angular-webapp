import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SocketService} from "../../service/socket.service";
import {Subscription} from "rxjs";


const LOST_SERVER_CONNECTION_TIMEOUT_MS = 3000

@Component({
  selector: 'app-camera-frame',
  templateUrl: './camera-frame.component.html'
})
export class CameraFrameComponent implements OnInit {

  @Output() statusEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() errorEmitter: EventEmitter<string> = new EventEmitter<string>();
  timeoutId: NodeJS.Timeout | undefined;

  frameDataSubscriber: Subscription | undefined;
  _frameData: string | undefined;

  initPhase: boolean = true;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.watchFrameData();
  }

  public watchFrameData(): void {
    this.frameDataSubscriber = this.socketService.getFrame().subscribe((data) => {
      if (this.initPhase) {
        this.emitStatusMessage('');
        this.startObservingFrameData();
        this.initPhase = false;
      }
      this._frameData = 'data:image/jpeg;base64,' + data.data;
    });
  }

  public pauseFrameData(): void {
    this.frameDataSubscriber?.unsubscribe();
  }

  public startObservingFrameData(): void {
    let lastValue = this._frameData;

    this.timeoutId = setInterval(() => {
      if (this._frameData && this._frameData === lastValue) {
        this.emitErrorMessage('Lost connection to the server!');
      } else {
        lastValue = this._frameData;
      }
    }, LOST_SERVER_CONNECTION_TIMEOUT_MS);
  }

  public stopObservingFrameData(): void {
    if (this.timeoutId) {
      clearInterval(this.timeoutId)
    }
    this.timeoutId = undefined;
  }

  private emitStatusMessage(message?: string): void {
    this.statusEmitter.emit(message);
  }

  private emitErrorMessage(message?: string): void {
    this.errorEmitter.emit(message);
  }

}
