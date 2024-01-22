import {Component, Input, OnInit} from '@angular/core';
import {VideoService} from "../../service/video.service";

@Component({
  selector: 'app-recording-preview',
  templateUrl: './recording-preview.component.html',
})
export class RecordingPreviewComponent implements OnInit {

  @Input() imageUrl: string = '';
  @Input() video_filename: string = '';
  video_duration_description: string | undefined;

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getVideoLink(this.video_filename).subscribe((response: any) => {
      this.video_duration_description = response.duration ? response.duration + " Seconds" : "Unknown";
    });
  }

  getSafeUrl(url: string) {
    return this.videoService.getSafeVideoUrl(url);
  }

  convertVideoNameToTimestamp(filename: string): string {
    return filename.split('.')[0];
  }

  convertTimestampToDescription(timestamp: string): string {
    const recordedTime = this.parseCustomTimestamp(timestamp);

    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - recordedTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
      return `recorded ${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `recorded ${minutes} minutes ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `recorded ${hours} hours ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `recorded ${days} days ago`;
    }
  }

  parseCustomTimestamp(timestamp: string): Date {
    const parts = timestamp.split('-');

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);
    const second = parseInt(parts[5], 10);

    return new Date(year, month, day, hour, minute, second);
  }

}
