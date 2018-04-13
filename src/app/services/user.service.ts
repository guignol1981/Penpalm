import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {User} from '../models/user/user';
import {SocialUser} from 'angular4-social-login';
@Injectable()
export class UserService {
    apiEndPoint = 'api/users';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static deserializeUser(data: any): User {
        return new User(
            data['_id'],
            data['name'],
            data['email'],
            data['photoUrl'],
            data['language'],
            data['country'],
            data['description'],
            data['showPicture'],
            data['showName'],
            data['enableEmailNotifications']
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

        return this.http.get(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

    find(): Promise<User[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/find', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let data = response.json().data;
                let users = [];

                data.forEach((userData) => {
                    users.push(UserService.deserializeUser(userData));
                });
                return users;
            })
            .catch(() => {
                return null;
            });
    }


    update(user: User): Promise<User> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });
        return this.http.put(this.apiEndPoint, JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

    remove(): Promise<Boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.delete(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch(() => {
                return null;
            });
    }

    sendRequest(user: User): Promise<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/request', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.json().data;
            })
            .catch(() => {
                return null;
            });
    }


}
