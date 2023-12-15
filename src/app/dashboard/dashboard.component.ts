import {Component, OnInit} from '@angular/core';
import {VideoService} from "../service/video.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  videoUrls: string[] = [];

  constructor(private videoService: VideoService) { }

  loadVideos() {
    this.videoUrls = this.videoService.loadVideos(3);
  }

  ngOnInit(): void {
    this.loadVideos();
  }

}
