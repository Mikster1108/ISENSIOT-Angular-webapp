import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "../../service/socket.service";

@Component({
  selector: 'app-camera-frame',
  templateUrl: './camera-frame.component.html'
})
export class CameraFrameComponent implements OnInit, OnDestroy {

  frameData: string | undefined;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getFrame().subscribe((data) => {
      this.frameData = 'data:image/jpeg;base64,' + data.data;
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }


}
