import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, SocialUser} from 'angular4-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";

@Injectable()
export class AuthenticationService {

    constructor(private router: Router,
                private authService: AuthService) {
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

    authenticateWithGoogle(): Promise<SocialUser> {
        return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
            return user;
        });
    }

    authenticateWithFB(): Promise<SocialUser> {
        return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
            return user;
        });
    }

    signOut(): void {
        localStorage.removeItem('id_token');
        this.authService.signOut().then(() => this.router.navigate(['/login']));
    }
}
