import { Component, OnInit } from '@angular/core';
import {VideoService} from "../service/video.service";

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css']
})
export class RecordingsComponent implements OnInit {

  errorMessage: string | undefined;

  video_links: string[] = [];
  video_filenames: string[] = [];

  constructor(private videoService: VideoService) { }


  ngOnInit(): void {
    this.videoService.getAllVideoLinks('date').subscribe((responseData: any) => {
      this.video_filenames = responseData.items;

      for (let i = 0; i<this.video_filenames.length; i++) {
        const filename = this.video_filenames[i];
        this.videoService.getPreviewImage(filename).subscribe((previewImage: any) => {
          let url = this.videoService.convertVideoToBlobUrl(previewImage);
          this.video_links.push(url);
        });
      }
    }, error => {
      this.errorMessage = error.error.err;
    });
  }

}
