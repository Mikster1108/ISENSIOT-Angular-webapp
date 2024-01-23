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
  videoDurationMs: number = 0;
  videoAnalysisData: Sensordata[] = [];
  activationReason: string | undefined;

  constructor(private videoService: VideoService, private route: ActivatedRoute, private timestampService: TimestampService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videoName = params['videoName'];
      this.loadVideo();
    });

    this.videoService.getVideoLink(this.videoName).subscribe((response: any) => {
      this.videoDurationMs = response.duration;
      const sensor_data = response.analysis_data;

      for (let data of sensor_data) {
        const new_data: Sensordata = new Sensordata(data.timestamp_ms, data.item_found);
        this.videoAnalysisData.push(new_data);
      }

      const first_item = this.videoAnalysisData[0];
      this.activationReason = first_item ? first_item.item_found : "Unknown";
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
    return this.timestampService.convertNumberToVideoTimestamp(timestamp);
  }

  convertTimestampToRealTimeFormat(secondsToAdd: number): string {
    const new_timestamp = this.timestampService.addSecondsToTimestamp(this.videoName, secondsToAdd);
    return this.timestampService.convertTimestampToRealTimeFormat(new_timestamp);
  }

  jumpToTimestamp(timestamp: number): void {
    const videoElement = document.getElementById("video") as HTMLVideoElement;
    const seconds = Math.floor(timestamp / 1000);
    videoElement.currentTime = seconds;

    videoElement.play();
  }

}
