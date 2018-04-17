import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Notification} from '../../models/notification/notification';

@Component({
    selector: 'app-base-view',
    templateUrl: './base-view.component.html',
    styleUrls: ['./base-view.component.scss']
})
export class BaseViewComponent implements OnInit {
    @Output() notificationEmitter: EventEmitter<Notification> = new EventEmitter<Notification>();

    constructor() {
    }

    ngOnInit() {
    }

}
