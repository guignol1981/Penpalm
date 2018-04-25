import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {SocialUser} from 'angular4-social-login';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit() {
    }

    showSignInModal() {

    }

    showRegisterModal() {

    }

    loginWithFacebook() {
        this.authenticationService.signInWithFB()
            .then((user: SocialUser) => {
                this.userService.signIn(user).then(success => {
                    if (success) {
                        this.router.navigate(['/home']);
                    }
                });
            });
    }

    loginWithGoogle() {
        this.authenticationService.signInWithGoogle()
            .then((user: SocialUser) => {
                this.userService.signIn(user).then(success => {
                    if (success) {
                        this.router.navigate(['/home']);
                    }
                });
            });
    }

}
