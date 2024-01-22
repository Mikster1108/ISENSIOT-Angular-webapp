import {Component, OnInit} from '@angular/core';
import {VideoService} from "../../service/video.service";
import {ActivatedRoute} from "@angular/router";
import {TimestampService} from "../../service/timestamp.service";
import {Sensordata} from "../../model/sensordata";

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html'
})
export class RecordingComponent implements OnInit {

  videoName: string = '';
  videoUrl: string[] | undefined;
  video_duration_description: string | undefined;
  video_analysis_data: Sensordata[] = [];
  activation_reason: string | undefined;

  constructor(private videoService: VideoService, private route: ActivatedRoute, private timestampService: TimestampService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videoName = params['videoName'];
      this.loadVideo();
    });

    this.videoService.getVideoLink(this.videoName).subscribe((response: any) => {
      let duration_sec = response.duration;
      const sensor_data = response.analysis_data;

      this.video_duration_description = this.timestampService.convertSecondsToReadableAmount(duration_sec);

      for (let data of sensor_data) {
        const new_data: Sensordata = new Sensordata(data.timestamp_ms, data.item_found);
        this.video_analysis_data.push(new_data);
      }

      const first_item = this.video_analysis_data[0];
      this.activation_reason = first_item ? first_item.item_found : "Unknown";
    });
  }

  loadVideo(): void {
    let videoName = [];
    videoName.push(this.videoName);
    this.videoUrl = this.videoService.loadVideos(videoName);
  }

  convertVideoNameToTimestamp(filename: string): string {
    return this.timestampService.convertVideoNameToTimestamp(filename);
  }

  convertTimestampToDescription(timestamp: string): string {
    return this.timestampService.convertTimestampToDescription(timestamp);
  }

  convertNumberTimestampToVideoTimestamp(timestamp: number): string {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

}
