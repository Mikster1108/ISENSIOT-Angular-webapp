import {Component, Input} from '@angular/core';
import {VideoService} from "../../service/video.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html'
})
export class VideoComponent {

  @Input() videoUrl: string = '';

  constructor(private videoService: VideoService) {
  }

  getSafeUrl() {
    return this.videoService.getSafeVideoUrl(this.videoUrl)
  }
}
