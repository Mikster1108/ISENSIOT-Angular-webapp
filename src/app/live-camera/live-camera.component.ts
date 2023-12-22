import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "../service/socket.service";

@Component({
  selector: 'app-live-camera',
  templateUrl: './live-camera.component.html',
})
export class LiveCameraComponent implements OnInit, OnDestroy {

  connected: boolean | undefined;
  responseMessage: string | undefined;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.listenForResponse()
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  connect() {
    this.socketService.connect().subscribe((response: any) => {
      if(response.data) {
        this.connected = true;
      }
    }, error => {
      this.connected = false;
        }
    );
  }

  disconnect() {
    this.socketService.disconnect();
    this.connected = false;
  }

  sendMessage(message: string): void {
    this.socketService.sendMessage(message);
  }

  listenForResponse(): void {
    this.socketService.onMessage().subscribe((response: any) => {
      this.responseMessage = response.data;
    });
  }

}
