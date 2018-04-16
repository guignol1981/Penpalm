import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Headers, Http, Response} from "@angular/http";

@Injectable()
export class GoogleMapService {

    apiEndPoint = 'api/geo-data';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    getGeoData(address: string): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint, JSON.stringify({address: address}), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.json();
            })
            .catch(() => {
                return null;
            });
    }

}
