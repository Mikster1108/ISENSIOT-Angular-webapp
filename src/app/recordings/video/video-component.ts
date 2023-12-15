import { Component } from '@angular/core';
import {VideoService} from "../../service/video.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {

  videoUrl: string = '';

  constructor(private videoService: VideoService) {
  }

  loadVideos(videoAmount: number, startIndex: number = 0, queryParam?: string, ): string[] {
    let videoUrls: string[] = [];

    this.videoService.getAllVideoLinks().subscribe(
    (allVideoData: any) => {
          let itemUrls = allVideoData.items.slice(0, videoAmount);
          for (let item of itemUrls) {
            this.videoService.getVideoLink(item).subscribe(
                (videoLinkData: any) => {
                  let videoLink = videoLinkData.video_link

                  this.videoService.getVideo(videoLink).then(blob => {
                    if (blob) {
                      let blobUrl = this.videoService.convertVideoToBlobUrl(blob);
                      videoUrls.push(blobUrl)
                    }
                  });
                }
            )
        }
      }
    )
    return videoUrls
  }
}
