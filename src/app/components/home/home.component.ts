import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from "../../models/user/user";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    user: User;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().then((user: User) => {
            this.user = user;
        });
    }

}
