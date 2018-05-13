import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {UtilService} from '../../services/util.service';
import {BaseViewComponent} from '../base-view/base-view.component';
import {Notification} from '../../models/notification/notification';
import {ENotification} from '../../models/notification/e-notification.enum';
import {ViewAction} from '../../models/actions/view-action';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {SingleInput} from '../../models/single-input/single-input';
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

        this.view = category;
        this.findFilter.type = category;

        this.find();
    }

    sendRequest(user: User) {
        if (this.transacting) {
            return;
        }
        this.transacting = true;
        this.userService.sendRequest(user).then((savedUser: User) => {
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request sent'));
            this.transacting = false;
            this.optionGroups = MatcherViewData.getOptions(this);
            this.find();
        });
    }

    cancelRequest(user: User) {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.cancelRequest(user).then((savedUser: User) => {
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request canceled'));
            this.transacting = false;
            this.optionGroups = MatcherViewData.getOptions(this);
            this.find();
        });
    }

    handleRequest(eventData: any) {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.handleRequest(eventData.user, eventData.accept).then((response: any) => {
            if (eventData.accept) {
                this.notificationEmitter.emit(new Notification(ENotification.Success, 'Pal added'));
                this.user = response.sourceUser;
            } else {
                this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request rejected'));
            }
            this.optionGroups = MatcherViewData.getOptions(this);
            this.transacting = false;
            this.optionGroups = MatcherViewData.getOptions(this);
            this.find();
        });
    }

    removePal(user: User) {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.removePal(user).then((response: any) => {
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Request removed'));
            this.user = response.sourceUser;
            this.transacting = false;
            this.optionGroups = MatcherViewData.getOptions(this);
            this.find();
        });
    }

}
