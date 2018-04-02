import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

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

    loginWithFacebook() {
        this.authenticationService.login().then(fbToken => {
            this.userService.signIn(fbToken).then(success => {
                if (success) {
                    this.router.navigate(['/home']);
                }
            });
        });
    }

    loginWithGoogle() {
        this.authenticationService.login().then(fbToken => {
            this.userService.signIn(fbToken).then(success => {
                if (success) {
                    this.router.navigate(['/home']);
                }
            });
        });
    }

}
