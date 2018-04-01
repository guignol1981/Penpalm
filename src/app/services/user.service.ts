import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {FacebookService, InitParams, LoginResponse, LoginStatus} from 'ngx-facebook';

@Injectable()
export class UserService {

    constructor(private http: Http, private fb: FacebookService) {
        let initParams: InitParams = {
            appId: '1788186814836142',
            xfbml: true,
            cookie: true,
            version: 'v2.8'
        };

        this.fb.init(initParams);
    }

    login() {
        this.fb.login()
            .then((response: LoginResponse) => {
                let token = response.authResponse.accessToken;
                this.signInToApp(token);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    signInToApp(fbToken) {
        return this.http.post('api/auth/facebook?access_token=' + fbToken, {})
            .toPromise()
            .then(response => {
                let token = response.headers.get('x-auth-token');
                if (token) {
                    localStorage.setItem('id_token', token);
                }
                console.log(response.json());
                this.getCurrentUser();
            })
            .catch(() => {});
    }

    logout() {
        localStorage.removeItem('id_token');
    }

    isLoggedIn() {
        return new Promise((resolve, reject) => {
            this.getCurrentUser().then(() => resolve(true)).catch(() => reject(false));
        });
    }

    getCurrentUser(): Promise<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('id_token')
        });

        return this.http.get(`api/users`, {headers: headers})
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(() => {
            });
    }

}
