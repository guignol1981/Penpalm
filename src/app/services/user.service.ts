import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {User} from '../models/user/user';
import {SocialUser} from 'angular4-social-login';
import {FindFilter} from '../components/matcher/matcher.component';
import {Credential} from '../components/login-modal/login-modal.component';

export interface FindFilter {
    country: string;
    language: string;
    type: string;
    skip: number;
    limit: number;
}

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

    register(registerData: any): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.post(this.apiEndPoint + '/register', JSON.stringify(registerData), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let token = response.headers.get('x-auth-token');
                this.authenticationService.saveToken(token);
                return true;
            })
            .catch((response: Response) => {
                return Promise.reject(response.json().msg);
            });
    }

    verifyEmail(link: string): Promise<boolean> {
        return this.http.put(this.apiEndPoint + '/verify-email/' + link, {})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch((response: Response) => {
                return false;
            });
    }

    resetPassword(password: string, link: string): Promise<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.put(this.apiEndPoint + '/reset-password/' + link, JSON.stringify({password: password}), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch((response: Response) => {
                return false;
            });
    }

    sendVerificationEmail(email: string): Promise<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.put(this.apiEndPoint + '/send-verification-email', JSON.stringify({email: email}), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch((response: Response) => {
                return false;
            });
    }

    sendRecoveryPasswordEmail(email: string): Promise<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.put(this.apiEndPoint + '/send-password-recovery-email', JSON.stringify({email: email}), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return true;
            })
            .catch((response: Response) => {
                return false;
            });
    }

    socialSignIn(socialUser: SocialUser): Promise<boolean> {
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
            .catch((response: Response) => {
                return Promise.reject(response.json().msg);
            });
    }

    localSignIn(credential: Credential): Promise<boolean> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.post('api/auth/local', JSON.stringify(credential), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let token = response.headers.get('x-auth-token');
                if (token) {
                    this.authenticationService.saveToken(token);
                    return true;
                }
            })
            .catch((response: Response) => {
                return Promise.reject(response.json().msg);
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

        return this.http.put(this.apiEndPoint + '/handle-request', JSON.stringify(user), {
            headers: headers,
            params: {accept: accept}
        })
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

    find(findFilter: FindFilter): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/' + findFilter.type, {headers: headers, params: findFilter})
            .toPromise()
            .then((response: Response) => {
                let data = response.json().data;
                let users = [];

                data.users.forEach((userData) => {
                    users.push(UserService.deserializeUser(userData));
                });

                return {
                    users: users,
                    count: data.count
                };
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
