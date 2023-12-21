import {Component, OnInit} from '@angular/core';
import {VideoService} from "../service/video.service";

const VIDEO_DISPLAY_AMOUNT = 3;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{

  videoUrls: string[] = [];
  showErrorMessage: boolean = false;

  constructor(private videoService: VideoService) { }

  loadVideos(): void {
    this.showErrorMessage = false;
    this.videoService.getAllVideoLinks('date', 1).subscribe(
        (responseData: any) => {
          let items = responseData.items;
          items = items.splice(0, VIDEO_DISPLAY_AMOUNT);

          this.videoUrls = this.videoService.loadVideos(items);

        }, error => {
          this.showErrorMessage = true;
        }
    );
  }

  ngOnInit(): void {
    this.loadVideos();
  }

}
