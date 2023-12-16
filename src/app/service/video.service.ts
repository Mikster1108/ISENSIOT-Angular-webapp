import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {firstValueFrom} from "rxjs";

const PATH = environment.apiUrl + '/video';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    getVideoLink(filename: string) {
        return this.http.get(`${PATH}/?filename=${filename}`)
    }

    getAllVideoLinks(queryParam?: string, page: number = 1) {
        return this.http.get(`${PATH}/all?filter=${queryParam}&page=${page}`)
    }

    getVideo(downloadUrl: string) {
        return firstValueFrom(this.http.get(downloadUrl, { responseType: 'blob' }));
    }

    convertVideoToBlobUrl(blob: Blob): string {
        return URL.createObjectURL(blob)
    }

    getSafeVideoUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    loadVideos(videoFilenames: string[]): string[] {
        let videoUrls: string[] = [];

        for(let videoFilename of videoFilenames) {
            this.getVideoLink(videoFilename).subscribe(
                (videoLinkData: any) => {
                    let videoLink = videoLinkData.video_link

                    this.getVideo(videoLink).then(blob => {
                        if (blob) {
                            let blobUrl = this.convertVideoToBlobUrl(blob);
                            videoUrls.push(blobUrl);
                        }
                    });
                }
            );
        }

        return videoUrls
    }
}
