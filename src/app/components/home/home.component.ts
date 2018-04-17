import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from "../../models/user/user";
import {Notification} from '../../models/notification/notification';
import {NotificationComponent} from '../notification/notification.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    user: User;
    activeTab = 'account';
    @ViewChild(NotificationComponent) notificationComponent: NotificationComponent;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().then((user: User) => {
            this.user = user;
        });
    }

    setTab(tab) {
        this.activeTab = tab;
    }

    onNotification(notification: Notification) {
        this.notificationComponent.setNotif(notification);
    }

}
