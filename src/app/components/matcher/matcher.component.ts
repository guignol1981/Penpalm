import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {UtilService} from '../../services/util.service';

export interface FindFilter {
    country: string;
    language: string;
}

@Component({
    selector: 'app-matcher',
    templateUrl: './matcher.component.html',
    styleUrls: ['./matcher.component.scss']
})
export class MatcherComponent implements OnInit {
    @Output() notifEvent: EventEmitter<Notification> = new EventEmitter<Notification>();
    user: User;
    userList: User[];
    selectedOption = '';
    selectedUser: User;
    countryList;
    languageList;
    findFilter = {
        country: 'none',
        language: 'none',
        pals: false
    };
    transacting = false;
    view = 'discover';
    removeWarning = false;

    constructor(private userService: UserService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.utilService.getCountries().then((countries) => {
            this.countryList = countries;
        });

        this.utilService.getLanguages().then((languages) => {
            this.languageList = languages;
        });

        this.userService.getCurrentUser().then((user: User) => {
            this.user = user;
            this.find();
        });
    }

    find(callback ?: any) {
        this.userService.find(this.findFilter).then((users: User[]) => {
            this.userList = users;

            if (callback) {
                callback();
            }
        });
    }

    selectUser(user: User) {
        this.selectedUser = user;
        this.view = 'details';
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    setLanguageFilter(language) {
        let me = this;
        let msg = language.name === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.language = language.name;

        let displayMsg = function () {
            // me.notifEvent.emit({type: 'success', msg: msg});
        };

        this.find(displayMsg);
    }

    setCountryFilter(country) {
        let me = this;
        let msg = country === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.country = country;

        let displayMsg = function () {
            me.notifEvent.emit({type: 'success', msg: msg});
        };
        this.find(displayMsg);
    }

    viewList() {
        this.selectedUser = null;
        this.view = 'discover';
        this.findFilter.pals = false;
        this.find();
    }

    sendRequest() {
        if (this.transacting) {
            return;
        }
        this.transacting = true;
        this.userService.sendRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.notifEvent.emit({type: 'success', msg: 'Request sent'});
            this.transacting = false;
        });
    }

    cancelRequest() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.cancelRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.notifEvent.emit({type: 'success', msg: 'Request canceled'});
            this.transacting = false;
        });
    }

    handleRequest(accept: boolean) {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.handleRequest(this.selectedUser, accept).then((response: any) => {
            if (accept) {
                this.notifEvent.emit({type: 'success', msg: 'Pal added'});
                this.selectedUser = response.targetUser;
                this.user = response.sourceUser;
            } else {
                this.notifEvent.emit({type: 'success', msg: 'Request rejected'});
            }

            this.transacting = false;
        });
    }

    removePal() {
        if (this.transacting) {
            return;
        }

        if (!this.removeWarning) {
            this.removeWarning = true;
            return;
        }

        this.transacting = true;
        this.userService.removePal(this.selectedUser).then((response: any) => {
            this.notifEvent.emit({type: 'success', msg: 'Pal removed'});
            this.selectedUser = response.targetUser;
            this.user = response.sourceUser;
            this.transacting = false;
        });
    }

    viewPals() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;

        this.view = 'pals';
        this.userService.getPals().then((users: User[]) => {
            this.userList = users;
            this.transacting = false;
        });
    }

    viewPendingRequests() {
        if (this.transacting) {
            return;
        }

        this.view = 'pending-requests';

        this.transacting = true;
        this.userService.getPendingRequests().then((users: User[]) => {
            this.userList = users;
            this.transacting = false;
        });
    }

    viewRequests() {
        if (this.transacting) {
            return;
        }

        this.view = 'sent-requests';

        this.transacting = true;
        this.userService.getRequests().then((users: User[]) => {
            this.userList = users;
            this.transacting = false;
        });
    }


    manage() {

    }

    report() {

    }
}
