import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {FacebookService, InitParams, LoginResponse, LoginStatus} from 'ngx-facebook';
import {AuthenticationService} from "./authentication.service";
import {User} from "../models/user/user";

@Injectable()
export class UserService {

    constructor(private http: Http,
                private fb: FacebookService,
                private authenticationService: AuthenticationService) {
        let initParams: InitParams = {
            appId: '1788186814836142',
            xfbml: true,
            cookie: true,
            version: 'v2.8'
        };

        this.fb.init(initParams);
    }

    public static deserializeUser(data: any): User {
        return new User(data['_id'], data['email']);
    }

    signIn(fbToken): Promise<boolean> {
        return this.http.post('api/auth/facebook?access_token=' + fbToken, {})
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

    getCurrentUser(): Promise<any> {
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
            });
    }

}
