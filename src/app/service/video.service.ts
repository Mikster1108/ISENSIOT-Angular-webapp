import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

const path = environment.apiUrl + '/video'

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(private http: HttpClient) {
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
}
