import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class ImageService {
    apiEndPoint = 'api/images';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
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
