import {Injectable} from '@angular/core';

@Injectable()
export class AuthenticationService {

    constructor() {
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

    logout() {
        localStorage.removeItem('id_token');
    }
}
