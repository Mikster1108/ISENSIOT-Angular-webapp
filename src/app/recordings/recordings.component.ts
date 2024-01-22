import { Component, OnInit } from '@angular/core';
import {VideoService} from "../service/video.service";

const ITEMS_PER_PAGE = 8;

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css']
})
export class RecordingsComponent implements OnInit {

  errorMessage: string | undefined;

  video_links: string[] = [];
  video_filenames: string[] = [];
  totalPages: number = 1;
  currentPage: number = 1;

  constructor(private videoService: VideoService) { }


  ngOnInit(): void {
    this.loadPreviews()
  }

  loadPreviews(): void {
    this.video_links = [];
    this.video_filenames = [];

    this.videoService.getAllVideoLinks('date', this.currentPage).subscribe((responseData: any) => {
      this.video_filenames = responseData.items;
      this.calculatePageAmount(responseData.total_items);

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

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage =  page;
      this.loadPreviews();
    }
  }

  calculatePageAmount(total_items: number): void {
    this.totalPages = Math.ceil(total_items / ITEMS_PER_PAGE);
  }

}
