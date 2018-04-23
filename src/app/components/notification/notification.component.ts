import {Component, Input, OnInit} from '@angular/core';
import {Notification} from '../../models/notification/notification';
import {ENotification} from '../../models/notification/e-notification.enum';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notification: Notification;

  constructor() { }

  ngOnInit() {
  }

  @Input()
  setNotif(notification: Notification) {
    this.notification = notification;
    this.displayNotification();
  }

  get notificationClass() {
    let cssClass = 'notification';

    switch (this.notification.type) {
        case ENotification.Danger:
          return cssClass += ' notification--danger';
        case ENotification.Success:
          return cssClass += ' notification--success';
        case ENotification.Warning:
          return cssClass += ' notification--warning';
    }
  }

  displayNotification() {
      setTimeout(() => {
          this.notification = null;
      }, 3000);
  }

}
