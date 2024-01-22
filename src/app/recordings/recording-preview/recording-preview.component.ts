import {Component, Input, OnInit} from '@angular/core';
import {VideoService} from "../../service/video.service";
import {TimestampService} from "../../service/timestamp.service";

@Component({
  selector: 'app-recording-preview',
  templateUrl: './recording-preview.component.html',
})
export class RecordingPreviewComponent implements OnInit {

  @Input() imageUrl: string = '';
  @Input() video_filename: string = '';
  video_duration_description: string | undefined;

  constructor(private videoService: VideoService, private timestampService: TimestampService) { }

  ngOnInit(): void {
    this.videoService.getVideoLink(this.video_filename).subscribe((response: any) => {
      const duration_sec = response.duration;
      this.video_duration_description = this.timestampService.convertSecondsToReadableAmount(duration_sec);
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

}
