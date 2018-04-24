import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {User} from '../models/user/user';
import {SocialUser} from 'angular4-social-login';
import {FindFilter} from '../components/matcher/matcher.component';

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
            data['photoData'],
            data['language'],
            data['country'],
            data['description'],
            data['showPicture'],
            data['showName'],
            data['enableEmailNotifications'],
            data['pendingRequests'],
            data['pals']
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

    getCurrentUser(id?: string): Promise<User> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint, {headers: headers, params: {id: id}})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

    handleRequest(user: User, accept: boolean): Promise<any> {

        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/handle-request', JSON.stringify(user), {headers: headers, params: {accept: accept}})
            .toPromise()
            .then((response: Response) => {
                if (accept) {
                    let data = response.json().data;
                    let targetUser = UserService.deserializeUser(data.targetUser);
                    let sourceUser = UserService.deserializeUser(data.sourceUser);

                    return {
                        targetUser: targetUser,
                        sourceUser: sourceUser
                    };
                } else {
                    return false;
                }
            })
            .catch(() => {
                return null;
            });
    }

    removePal(user: User): Promise<any> {

        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/remove-pal', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let data = response.json().data;
                let targetUser = UserService.deserializeUser(data.targetUser);
                let sourceUser = UserService.deserializeUser(data.sourceUser);

                return {
                    targetUser: targetUser,
                    sourceUser: sourceUser
                };
            })
            .catch(() => {
                return null;
            });
    }

    find(findFitler: FindFilter): Promise<User[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/' + findFitler.type, {headers: headers, params: findFitler})
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

    sendRequest(user: User): Promise<User> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/request', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }

    cancelRequest(user: User): Promise<User> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/cancel-request', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return UserService.deserializeUser(response.json().data);
            })
            .catch(() => {
                return null;
            });
    }


}
