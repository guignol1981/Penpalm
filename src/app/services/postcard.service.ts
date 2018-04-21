import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Postcard} from '../models/postcard/postcard';
import {AuthenticationService} from './authentication.service';
import {UserService} from './user.service';

@Injectable()
export class PostcardService {
    apiEndPoint = 'api/postcards';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static deserializePostcard(data: any): Postcard {

        return new Postcard(
            // data['_id'],
            // data['body'],
            // data['imageUrl'],
            // data['uploadedImage'],
            // data['imageFitType'],
            // data['spotifyLink'],
            // data['youtubeId'],
            // data['allowShare'],
            // data['template'],
            // data['location'],
            // data['recipient'],
            // UserService.deserializeUser(data['author']),
            // data['seen'],
            // data['creationDate']
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

    markSeen(postcard: Postcard): Promise<Postcard> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/seen', JSON.stringify(postcard), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return PostcardService.deserializePostcard(response.json().data);
            })
            .catch(() => null);
    }

    fetch(fetchConfig: any): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/' + fetchConfig.direction, {headers: headers, params: fetchConfig})
            .toPromise()
            .then((response: Response) => {
                let postcards = [];
                let data = response.json().data;

                data.postcards.forEach(postcardData => {
                    postcards.push(PostcardService.deserializePostcard(postcardData));
                });

                return {postcards: postcards, count: data.count};
            })
            .catch(() => null);
    }


}
