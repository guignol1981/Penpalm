import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {User} from '../models/user/user';
import {SocialUser} from 'angular4-social-login';
import {News} from "../models/news/news";

@Injectable()
export class UserService {

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static deserializeUser(data: any): User {
        let penPal = new User();
        let newsList = [];

        if (data['penPal']) {
            let penPalData = data['penPal'];
            penPal._id = penPalData['_id'];
            penPal.photoUrl = penPalData['photoUrl'];
        }

        data['newsList'].forEach(newsData => {
            newsList.push(new News(
                newsData['_id'],
                newsData['title'],
                newsData['body'],
                newsData['imageUrl']
            ));
        });

        return new User(
            data['_id'],
            data['email'],
            data['photoUrl'],
            penPal,
            newsList
        );
    }

    signIn(socialUser: SocialUser): Promise<boolean> {
        return this.http.post(`api/auth/${socialUser.provider.toLowerCase()}?access_token=${socialUser.authToken}`,
            {socialUser: socialUser})
            .toPromise()
            .then((response: Response) => {
                let token = response.headers.get('x-auth-token');
                if (token) {
                    this.authenticationService.saveToken(token);
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    }

    getCurrentUser(): Promise<User> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(`api/users`, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

}
