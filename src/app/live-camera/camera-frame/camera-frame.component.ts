import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SocketService} from "../../service/socket.service";
import {Observable, Subscription} from "rxjs";


@Component({
  selector: 'app-camera-frame',
  templateUrl: './camera-frame.component.html'
})
export class CameraFrameComponent implements OnInit {

  @Output() streamStopped: EventEmitter<void> = new EventEmitter<void>();
  timeoutId: NodeJS.Timeout | undefined;

  frameDataSubscriber: Subscription | undefined;
  _frameData: string | undefined;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.watchFrameData();
    this.startObservingFrameData();
  }

  public watchFrameData(): void {
    this.frameDataSubscriber = this.socketService.getFrame().subscribe((data) => {
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
        this.handleStreamStop();
      } else {
        lastValue = this._frameData;
      }
    }, 3000);
  }

  public stopObservingFrameData()  {
    if (this.timeoutId) {
      clearInterval(this.timeoutId)
    }
    this.timeoutId = undefined;
  }

  private handleStreamStop(): void {
    this.streamStopped.emit();
  }
  //
  // public getFrameData(): string | undefined {
  //   return this._frameData;
  // }

}
