import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {User} from '../models/user/user';
import {SocialUser} from 'angular4-social-login';
@Injectable()
export class UserService {
    apiEndPoint = 'api/users';

    headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authenticationService.getToken()
    });

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
        return this.http.get(this.apiEndPoint, {headers: this.headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

    find(): Promise<User[]> {
        return this.http.get(this.apiEndPoint, {headers: this.headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }


    update(user: User): Promise<User> {
        return this.http.put(this.apiEndPoint, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

    remove(): Promise<Boolean> {
        return this.http.delete(this.apiEndPoint, {headers: this.headers})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch(() => {
                return null;
            });
    }


}
