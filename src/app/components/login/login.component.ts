import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {supportsState} from "@angular/platform-browser/src/browser/location/history";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private userService: UserService,
                private router: Router) {
    }

    ngOnInit() {
    }

    loginWithFacebook() {
        this.userService.login().then(success => {
            if (success) {
                this.router.navigate(['/home']);
            }
        });
    }

}
