import {Component, OnInit} from '@angular/core';
import {VideoService} from "../../service/video.service";
import {ActivatedRoute} from "@angular/router";
import {TimestampService} from "../../service/timestamp.service";
import {Sensordata} from "../../model/sensordata";
import {Recording} from "../../model/recording";

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html'
})
export class RecordingComponent implements OnInit {

  errorMessage: string | undefined;

  recording: Recording | undefined;
  activationReason: string | undefined;

  constructor(private videoService: VideoService, private route: ActivatedRoute, private timestampService: TimestampService) { }

  ngOnInit(): void {
    let videoName: string = '';
    let videoUrl: string[] = [];
    let videoDurationMs: number = 0;
    let videoAnalysisData: Sensordata[] = [];

    this.route.params.subscribe(params => {
      videoName = params['videoName'];
      videoUrl = this.loadVideo(videoName);
    });

    this.videoService.getVideoLink(videoName).subscribe((response: any) => {
      videoDurationMs = response.duration;
      const sensor_data = response.analysis_data;

      for (let data of sensor_data) {
        const new_data: Sensordata = new Sensordata(data.timestamp_ms, data.item_found);
        videoAnalysisData.push(new_data);
      }

      const first_item = videoAnalysisData[0];
      this.activationReason = first_item ? first_item.item_found : "Unknown";

      this.recording = new Recording(videoName, videoDurationMs, videoAnalysisData, videoUrl);
    }, error => {
      this.errorMessage = "No Video found";
    });
  }

  loadVideo(videoName: string): string [] {
    let videoNameResult = [];
    videoNameResult.push(videoName);
    return this.videoService.loadVideos(videoNameResult);
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
    const new_timestamp = this.timestampService.addSecondsToTimestamp(<string>this.recording?.name, secondsToAdd);
    return this.timestampService.convertTimestampToRealTimeFormat(new_timestamp);
  }

  jumpToTimestamp(timestamp: number): void {
    const videoElement = document.getElementById("video") as HTMLVideoElement;
    const seconds = Math.floor(timestamp / 1000);
    videoElement.currentTime = seconds;

    videoElement.play();
  }

}
