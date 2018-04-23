import { Injectable } from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class UtilService {
    apiEndPoint = 'api/util';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }


    getCountries(): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/countries', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.json().data;
            })
            .catch(() => {
                return null;
            });
    }

    getLanguages(): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/languages', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.json().data;
            })
            .catch(() => {
                return null;
            });
    }


    getCardTemplates(): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/templates', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.json().data;
            })
            .catch(() => {
                return null;
            });
    }

}
