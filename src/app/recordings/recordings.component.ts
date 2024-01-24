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

  videoLinks: Map<string, string> = new Map<string, string>();
  videoFilenames: string[] = [];
  totalPages: number = 1;
  currentPage: number = 1
  totalItems: number = 0;
  itemsPerPage: number = 0;

  filterOptions: string[] = [
    'Most recent recordings',
    'Oldest recordings',
    'Longest recordings',
    'Shortest recordings',
  ];
  selectedOption: string | undefined;
  queryParam: string | undefined;
  reversed: boolean = true;

  constructor(private videoService: VideoService, private router: Router) { }


  ngOnInit(): void {
    this.loadPreviews()
    this.selectedOption = this.filterOptions[0];
  }

  loadPreviews(): void {
    this.videoLinks = new Map<string, string>();
    this.videoFilenames = [];
    this.convertFilterOptionToQueryParam();

    this.videoService.getAllVideoLinks(this.queryParam, this.currentPage, this.reversed).subscribe((responseData: any) => {
      this.videoFilenames = responseData.items;
      this.totalItems = responseData.total_items;
      this.itemsPerPage = responseData.items.length;
      this.calculatePageAmount();

      for (let i = 0; i<this.videoFilenames.length; i++) {
        const filename = this.videoFilenames[i];
        this.videoService.getPreviewImage(filename).subscribe((previewImage: any) => {
          let url = this.videoService.convertVideoToBlobUrl(previewImage);
          this.videoLinks.set(filename, url);
        });
      }
    }, error => {
      this.errorMessage = error.error.err;
    });
  }

  calculatePageAmount(): void {
    this.totalPages = Math.ceil(this.totalItems / ITEMS_PER_PAGE);
  }

  convertFilterOptionToQueryParam(): void {
    switch (this.selectedOption) {
      case 'Most recent recordings':
        this.queryParam = 'date';
        this.reversed = true
        break;
      case 'Oldest recordings':
        this.queryParam = 'date';
        this.reversed = false
        break;
      case 'Longest recordings':
        this.queryParam = 'duration';
        this.reversed = true
        break;
      case 'Shortest recordings':
        this.queryParam = 'duration';
        this.reversed = false
        break;
      default:
        this.queryParam = 'date';
    }
  }

  getPreviewImage(filename: string): string {
    return <string>this.videoLinks.get(filename);
  }

  onRecordingClick(videoName: string): void {
    this.router.navigate(['/recording', videoName]);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage =  page;
      this.loadPreviews();
    }
  }

  setSelectedFilter(option: string | undefined): void {
    this.selectedOption = option;
    this.loadPreviews();
  }
}
