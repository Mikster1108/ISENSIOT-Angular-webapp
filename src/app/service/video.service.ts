import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

const path = environment.apiUrl + '/video'

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    getVideoLink(file: string) {
        return this.http.get(path + '/?filename=' + file)
    }

    getAllVideoLinks() {
        return this.http.get(path + '/all')
    }

    getVideo(downloadUrl: string) {
        return this.http.get(downloadUrl, { responseType: 'blob' }).toPromise();
    }

    convertVideoToBlobUrl(blob: Blob) {
        return URL.createObjectURL(blob)
    }

    getSafeVideoUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    loadVideos(videoAmount: number, startIndex: number = 0, queryParam?: string, ): string[] {
        let videoUrls: string[] = [];

        this.getAllVideoLinks().subscribe(
            (allVideoData: any) => {
                let itemUrls = allVideoData.items.slice(0, videoAmount);
                for (let item of itemUrls) {
                    this.getVideoLink(item).subscribe(
                        (videoLinkData: any) => {
                            let videoLink = videoLinkData.video_link

                            this.getVideo(videoLink).then(blob => {
                                if (blob) {
                                    let blobUrl = this.convertVideoToBlobUrl(blob);
                                    videoUrls.push(blobUrl);
                                }
                            });
                        }
                    )
                }
            }
        )
        return videoUrls
    }
}
