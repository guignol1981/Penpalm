import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {UtilService} from '../../services/util.service';
import {BaseViewComponent} from '../base-view/base-view.component';
import {Notification} from '../../models/notification/notification';
import {ENotification} from '../../models/notification/e-notification.enum';
import {ViewAction} from '../../models/actions/view-action';
import {ViewOption} from '../../models/options/view-option';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {EViewAction} from '../../models/actions/e-view-action.enum';
import {SingleInput} from '../../models/single-input/single-input';
import {ESingleInput} from '../../models/single-input/e-single-input.enum';
import {MatcherViewData} from '../../models/view-data/matcher-view-data';

export interface FindFilter {
    country: string;
    language: string;
    type: string;
}

@Component({
    selector: 'app-matcher',
    templateUrl: './matcher.component.html',
    styleUrls: ['./matcher.component.scss', '../base-view/base-view.component.scss']
})
export class MatcherComponent extends BaseViewComponent implements OnInit {
    user: User;
    userList: User[];
    selectedUser: User = null;
    countryList;
    languageList;
    filterDisplayed = null;

    findFilter = {
        country: 'none',
        language: 'none',
        type: 'discover'
    };

    transacting = false;
    view = 'discover';

    inputs: SingleInput[];
    actions: ViewAction[];
    optionGroups: ViewOptionGroup[];

    constructor(private userService: UserService,
                private utilService: UtilService) {
        super();
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
            this.actions = MatcherViewData.getActions(this);
            this.optionGroups = MatcherViewData.getOptions(this);
            this.inputs = MatcherViewData.getInputs(this);
            this.find();
        });
    }

    find(callback ?: any) {
        this.transacting = true;

        this.userService.find(this.findFilter).then((users: User[]) => {
            this.userList = users;
            this.transacting = false;

            if (callback) {
                callback();
            }
        });
    }

    selectUser(user: User) {
        this.filterDisplayed = 'none';
        this.selectedUser = user;
        this.view = 'details';
    }

    setLanguageFilter(language) {
        let me = this;
        let msg = language === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.language = language;

        let displayMsg = function () {
            me.notificationEmitter.emit(new Notification(ENotification.Success, msg));
        };

        this.find(displayMsg);
    }

    setCountryFilter(country) {
        let me = this;
        let msg = country === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.country = country;

        let displayMsg = function () {
            me.notificationEmitter.emit(new Notification(ENotification.Success, msg));
        };
        this.find(displayMsg);
    }

    viewList(category) {
        if (this.transacting) {
            return;
        }

        if (category !== 'discover') {
            this.filterDisplayed = 'none';
        }

        this.selectedUser = null;
        this.view = category;
        this.findFilter.type = category;

        this.find();
    }

    sendRequest() {
        if (this.transacting) {
            return;
        }
        this.transacting = true;
        this.userService.sendRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request sent'));
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
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request canceled'));
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
                this.notificationEmitter.emit(new Notification(ENotification.Success, 'Pal added'));
                this.selectedUser = response.targetUser;
                this.user = response.sourceUser;
            } else {
                this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request rejected'));
            }

            this.transacting = false;
        });
    }

    removePal() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.removePal(this.selectedUser).then((response: any) => {
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request removed'));
            this.selectedUser = response.targetUser;
            this.user = response.sourceUser;
            this.transacting = false;
        });
    }

}
