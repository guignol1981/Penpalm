import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {SocialUser} from 'angular4-social-login';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {RegisterModalComponent} from '../register-modal/register-modal.component';
import {AlertModalComponent} from "../alert-modal/alert-modal.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    showLogingModalComponent = false;
    showRegisterModalComponent = false;
    showAlertModalComponent = false;
    
    alertMessage: string;
    @ViewChildren('loginmodal')
    loginModalComponents: QueryList<LoginModalComponent>;
    logingModalComponent: LoginModalComponent;

    @ViewChildren('registermodal')
    registerModalComponents: QueryList<RegisterModalComponent>;
    registerModalComponent: RegisterModalComponent;

    @ViewChildren('alertmodal')
    alertModalComponents: QueryList<AlertModalComponent>;
    alertModalComponent: AlertModalComponent;

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.loginModalComponents.changes.subscribe((comps: QueryList<LoginModalComponent>) => {
            if (comps.length > 0) {
                this.logingModalComponent = comps.first;
            }
        });

        this.registerModalComponents.changes.subscribe((comps: QueryList<RegisterModalComponent>) => {
            if (comps.length > 0) {
                this.registerModalComponent = comps.first;
            }
        });

        this.alertModalComponents.changes.subscribe((comps: QueryList<AlertModalComponent>) => {
            if (comps.length > 0) {
                this.alertModalComponent = comps.first;
            }
        });
    }

    showSignInModal() {
        this.showLogingModalComponent = true;
    }

    showRegisterModal() {
        this.showRegisterModalComponent = true;
    }

    onLoginModalComponentClose() {
        this.showLogingModalComponent = false;
    }

    onRegisterModalComponentClose() {
        this.showRegisterModalComponent = false;
    }

    onAlertModalComponentClose() {
        this.showAlertModalComponent = false;
        this.alertMessage = null;
    }

    loginWithFacebook() {
        this.authenticationService.authenticateWithFB()
            .then((user: SocialUser) => {
                this.userService.socialSignIn(user)
                    .then(success => {
                        if (success) {
                            this.router.navigate(['/home']);
                        }
                    })
                    .catch(msg => {
                        this.alertMessage = msg;
                        this.showAlertModalComponent = true;
                    });
            });
    }

    loginWithGoogle() {
        this.authenticationService.authenticateWithGoogle()
            .then((user: SocialUser) => {
                this.userService.socialSignIn(user)
                    .then(success => {
                        if (success) {
                            this.router.navigate(['/home']);
                        }
                    })
                    .catch(msg => {
                        this.alertMessage = msg;
                        this.showAlertModalComponent = true;
                    });
            });
    }

}
