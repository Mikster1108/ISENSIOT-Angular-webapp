import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {firstValueFrom, forkJoin, Observable} from "rxjs";

const PATH = environment.apiUrl + '/video';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    getVideoLink(filename: string): Observable<any> {
        return this.http.get(`${PATH}/?filename=${filename}`)
    }

    getAllVideoLinks(queryParam?: string, page: number = 1, reverse: boolean = true): Observable<any> {
        return this.http.get(`${PATH}/all?filter=${queryParam}&page=${page}&reverse=${reverse}`)
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

        const videoObservables = videoFilenames.map(videoFilename => this.getVideoLink(videoFilename));

        // Combine video observables into one
        forkJoin(videoObservables).subscribe((videoLinkDataArray: any[]) => {
            const videoBlobPromises: Promise<Blob>[] = [];

            // Get video link of each file and store it as a promise
            for (const videoLinkData of videoLinkDataArray) {
                const videoLink = videoLinkData.video_link;
                videoBlobPromises.push(this.getVideo(videoLink));
            }

            // Wait before all promises are resolved, then convert videoBlobs to URLs
            Promise.all(videoBlobPromises).then(videoBlobs => {
                for (let videoBlob of videoBlobs) {
                    if (videoBlob) {
                        const blobUrl = this.convertVideoToBlobUrl(videoBlob);
                        videoUrls.push(blobUrl);
                    } else {
                        videoUrls.push('')
                    }
                }
            });
        }, error => {

        });

        return videoUrls
    }

    getPreviewImage(video_name: string): Observable<any> {
        return this.http.get(`${PATH}/video-preview?filename=${video_name}`, { responseType: 'blob' });
    }
}
