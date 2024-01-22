import {Component, OnInit} from '@angular/core';
import {VideoService} from "../../service/video.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html'
})
export class RecordingComponent implements OnInit {

  showErrorMessage: boolean = false;
  videoName: string = '';
  videoUrl: string[] | undefined;

  constructor(private videoService: VideoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videoName = params['videoName'];
      this.loadVideo();
    });
  }

  loadVideo(): void {
    this.showErrorMessage = false;
    let videoName = [];
    videoName.push(this.videoName);
    this.videoUrl = this.videoService.loadVideos(videoName);
  }
}
