import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {Notification} from '../../models/notification/notification';
import {NotificationComponent} from '../notification/notification.component';
import {ImageUploadEvent, UploaderModalComponent} from '../uploader-modal/uploader-modal.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    user: User;
    activeTab = 'account';
    showImageUploadModal = false;

    @ViewChild(NotificationComponent)
    notificationComponent: NotificationComponent;

    @ViewChildren('uploadermodal')
    uploaderModalComponents: QueryList<UploaderModalComponent>;
    uploaderModalComponent: UploaderModalComponent;
    imageUploadEvent: ImageUploadEvent;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().then((user: User) => {
            this.user = user;
        });
    }

    ngAfterViewInit() {
        this.uploaderModalComponents.changes.subscribe((comps: QueryList<UploaderModalComponent>) => {
            if (comps.length > 0) {
                this.uploaderModalComponent = comps.first;
                this.uploaderModalComponent.setEvent(this.imageUploadEvent);
            }
        });
    }

    setTab(tab) {
        this.activeTab = tab;
    }

    onNotification(notification: Notification) {
        this.notificationComponent.setNotif(notification);
    }

    onImageUploadEvent(event: ImageUploadEvent) {
        this.showImageUploadModal = true;
        this.imageUploadEvent = event;
    }

    onImageModalCloseEvent() {
        this.showImageUploadModal = false;
        this.imageUploadEvent = null;
    }

}
