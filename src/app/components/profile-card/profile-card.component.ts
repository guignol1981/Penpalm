import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user/user';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
    @Input() user: User;
    @Input() cardUser: User;
    @Output() sendRequestEmitter: EventEmitter<User> = new EventEmitter<User>();
    @Output() cancelRequestEmitter: EventEmitter<User> = new EventEmitter<User>();
    @Output() handleRequestEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() removePalEmitter: EventEmitter<User> = new EventEmitter<User>();

    constructor() {
    }

    ngOnInit() {
    }

    sendRequest() {
        this.sendRequestEmitter.emit(this.cardUser);
    }

    cancelRequest() {
        this.cancelRequestEmitter.emit(this.cardUser);
    }

    handleRequest(accept: boolean) {
        this.handleRequestEmitter.emit({user: this.cardUser, accept: accept});
    }

    removePal() {
        this.removePalEmitter.emit(this.cardUser);
    }

}
