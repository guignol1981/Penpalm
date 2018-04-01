import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {FacebookService, LoginResponse} from 'ngx-facebook';

@Injectable()
export class AuthenticationService {

    constructor(private router: Router,
                private fb: FacebookService) {
    }

    saveToken(token) {
        localStorage.setItem('id_token', token);
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    isLoggedIn() {
        let token = this.getToken();
        let payload;

        if (token) {
            payload = token.split('.')[1];
            payload = atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    login(): Promise<any> {
        return this.fb.login()
            .then((response: LoginResponse) => {
                return response.authResponse.accessToken;
            })
            .catch(() => {
                return false;
            });
    }

    logout() {
        localStorage.removeItem('id_token');
        this.fb.logout().then(() => {
            this.router.navigate(['/login']);
        });
    }
}
