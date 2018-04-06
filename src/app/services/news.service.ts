import {Injectable} from '@angular/core';
import {Headers, Http, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {News} from "../models/news/news";

@Injectable()
export class NewsService {

    apiEndPoint = 'api/news';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static deserializeNews(data: any): News {
        return new News(
            data['title'],
            data['imageUrl']
        );
    }

    fetch(): Promise<News> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return NewsService.deserializeNews(response.json().data);
            })
            .catch(() => null);
    }

}
