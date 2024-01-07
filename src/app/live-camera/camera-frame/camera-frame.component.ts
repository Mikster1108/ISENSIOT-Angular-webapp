import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SocketService} from "../../service/socket.service";


@Component({
  selector: 'app-camera-frame',
  templateUrl: './camera-frame.component.html'
})
export class CameraFrameComponent implements OnInit {

  @Output() streamStopped: EventEmitter<void> = new EventEmitter<void>();
  timeoutId: any;

  frameData: string | undefined;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getFrame().subscribe((data) => {
      this.frameData = 'data:image/jpeg;base64,' + data.data;
    });

    this.startObservingFrameData();
  }

  private startObservingFrameData(): void {
    let lastValue = this.frameData;

    this.timeoutId = setInterval(() => {
      if (this.frameData && this.frameData === lastValue) {
        this.handleStreamStop();
      } else {
        lastValue = this.frameData;
      }
    }, 3000);
  }

  private handleStreamStop(): void {
    this.streamStopped.emit();
  }

}
