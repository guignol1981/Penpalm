import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from "../../models/user/user";
import {AuthenticationService} from '../../services/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    user: User;
    activeTabs = 'news';

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().then((user: User) => {
            this.user = user;
        });
    }

    setTab(tab) {
        this.activeTabs = tab;
    }

    logout() {
        this.authenticationService.signOut();
    }

}
