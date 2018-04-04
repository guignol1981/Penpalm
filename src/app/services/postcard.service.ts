import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Postcard} from '../models/postcard/postcard';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class PostcardService {
    apiEndPoint = 'api/postcards';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static deserializePostcard(data: any): Postcard {
        return new Postcard(
            data['_id'],
            data['body'],
            data['creationDate']
        );
    }

    create(postcard: Postcard): Promise<Postcard> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.post(this.apiEndPoint, JSON.stringify(postcard), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return PostcardService.deserializePostcard(response.json().data);
            })
            .catch(() => null);
    }

    getInbox(): Promise<Postcard[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/inbox', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let postcards = [];
                response.json().data.forEach(postcardData => {
                    postcards.push(PostcardService.deserializePostcard(postcardData));
                });
                return postcards;
            })
            .catch(() => null);
    }

    getSent(): Promise<Postcard[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/sent', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let postcards = [];
                response.json().data.forEach(postcardData => {
                    postcards.push(PostcardService.deserializePostcard(postcardData));
                });
                return postcards;
            })
            .catch(() => null);
    }

}
