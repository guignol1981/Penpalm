import {Component, OnInit} from '@angular/core';
import {FacebookService, InitParams, LoginResponse, LoginStatus} from 'ngx-facebook';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private fb: FacebookService) {
    }

    ngOnInit() {
        this.initFacebook();
    }

    initFacebook() {
        let initParams: InitParams = {
            appId: '1788186814836142',
            xfbml: true,
            cookie     : true,
            version: 'v2.8'
        };

        this.fb.init(initParams);
        this.fb.getLoginStatus().then((response: LoginStatus) => console.log(response));
    }

    loginWithFacebook() {
        this.fb.login()
            .then((response: LoginResponse) => {
                console.log(response);
                this.fb.api('/me').then(graphResponse => console.log(graphResponse));
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

}
