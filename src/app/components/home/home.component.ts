import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from "../../models/user/user";
import {AuthenticationService} from '../../services/authentication.service';

export interface Notif {
    type: string;
    msg: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    user: User;
    activeTab = 'matcher';
    notif: Notif;

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().then((user: User) => {
            this.user = user;
        });
    }

    setTab(tab) {
        this.activeTab = tab;
    }

    logout() {
        this.authenticationService.signOut();
    }

    onNotif(notif: Notif) {
       this.notif = notif;
        setTimeout(() => {
            this.notif = null;
        }, 3000);
    }

}
