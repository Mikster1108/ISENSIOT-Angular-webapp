import {Component, OnInit} from '@angular/core';
import {VideoService} from "../service/video.service";

const VIDEO_DISPLAY_AMOUNT = 3;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  videoUrls: string[] = [];

  constructor(private videoService: VideoService) { }

  loadVideos(): void {
    this.videoService.getAllVideoLinks('duration', 1).subscribe(
        (responseData: any) => {
          let items = responseData.items;
          items = items.splice(0, VIDEO_DISPLAY_AMOUNT);

          this.videoUrls = this.videoService.loadVideos(items);
        }
    );
  }

  ngOnInit(): void {
    this.loadVideos();
  }

}
