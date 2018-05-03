import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class ImageService {
    apiEndPoint = 'api/images';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }


    public upload(image: any, partName: string = 'image'): Promise<any> {
        let headers = new Headers({
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        let formData = new FormData();

        formData.append(partName, image);
        return this.http.post(this.apiEndPoint, formData, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.json().data;
            })
            .catch((response: Response) => {
                return false;
            });
    }

    remove(cloudStorageObject: string): Promise<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.delete(this.apiEndPoint + '/' + cloudStorageObject, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch((response: Response) => {
                return false;
            });
    }

}
