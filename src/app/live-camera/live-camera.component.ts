import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "../service/socket.service";

@Component({
  selector: 'app-live-camera',
  templateUrl: './live-camera.component.html',
})
export class LiveCameraComponent implements OnInit, OnDestroy {

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  connect() {
    this.socketService.connectToNamespace('/test');
  }

  disconnect() {
    this.socketService.disconnect();
  }

  sendMessage(message: string): void {
    this.socketService.sendMessage(message);
  }

  listenForResponse(): void {
    this.socketService.onMessage().subscribe((response: any) => {
      console.log('Response received:', response);
    });
  }

}
