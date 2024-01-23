import { Component, OnInit } from '@angular/core';
import {VideoService} from "../service/video.service";
import {Router} from "@angular/router";

const ITEMS_PER_PAGE = 8;

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html'
})
export class RecordingsComponent implements OnInit {

  errorMessage: string | undefined;

  videoLinks: string[] = [];
  videoFilenames: string[] = [];
  totalPages: number = 1;
  currentPage: number = 1;

  filterOptions: string[] = ['date', 'duration'];
  selectedOption: string | undefined;

  constructor(private videoService: VideoService, private router: Router) { }


  ngOnInit(): void {
    this.loadPreviews()
    this.selectedOption = this.filterOptions[0];
  }

  loadPreviews(): void {
    this.videoLinks = [];
    this.videoFilenames = [];
    const query_param = this.selectedOption ? this.selectedOption : this.filterOptions[0];

    this.videoService.getAllVideoLinks(query_param, this.currentPage).subscribe((responseData: any) => {
      this.videoFilenames = responseData.items;
      this.calculatePageAmount(responseData.total_items);

      for (let i = 0; i<this.videoFilenames.length; i++) {
        const filename = this.videoFilenames[i];
        this.videoService.getPreviewImage(filename).subscribe((previewImage: any) => {
          let url = this.videoService.convertVideoToBlobUrl(previewImage);
          this.videoLinks.push(url);
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

  setSelectedFilter(option: string | undefined) {
    this.selectedOption = option;
    this.loadPreviews()
  }

  onRecordingClick(videoName: string): void {
    this.router.navigate(['/recording', videoName]);
  }
}
