import {Component, Input, OnInit} from '@angular/core';
import {VideoService} from "../../service/video.service";
import {TimestampService} from "../../service/timestamp.service";

@Component({
  selector: 'app-recording-preview',
  templateUrl: './recording-preview.component.html',
})
export class RecordingPreviewComponent implements OnInit {

  @Input() imageUrl: string = '';
  @Input() videoFilename: string = '';
  videoDurationMs: number = 0;

  constructor(private videoService: VideoService, private timestampService: TimestampService) { }

  ngOnInit(): void {
    this.videoService.getVideoLink(this.videoFilename).subscribe((response: any) => {
      this.videoDurationMs = response.duration;
    });
  }

  getSafeUrl(url: string) {
    return this.videoService.getSafeVideoUrl(url);
  }

  convertVideoNameToTimestamp(filename: string): string {
    return this.timestampService.convertVideoNameToTimestamp(filename);
  }

  convertTimestampToDescription(timestamp: string): string {
    return this.timestampService.convertTimestampToDescription(timestamp);
  }

  convertNumberTimestampToVideoTimestamp(timestamp: number): string {
    return this.timestampService.convertNumberToVideoTimestamp(timestamp);
  }

}
