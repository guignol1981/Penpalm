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

export interface FindFilter {
    country: string;
    language: string;
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
    findFilter = {
        country: 'none',
        language: 'none',
        pals: false
    };
    transacting = false;
    view = 'discover';
    removeWarning = false;

    actions = [
        new ViewAction(
            'Show more',
            () => {
                this.find();
            },
            EViewAction.Primary,
            false,
            () => {
                return this.view === 'discover';
            }
        )
    ];

    optionGroups = [
        new ViewOptionGroup(
            'Pen pals',
            [
                new ViewOption('Discover', () => {
                    this.viewList();
                }, false, true),
                new ViewOption('My pals', () => {
                    this.viewPals();
                }, false, true),
                new ViewOption('Pending requests', () => {
                    this.viewPendingRequests();
                }, false, true),
                new ViewOption('Sent requests', () => {
                    this.viewSentRequests();
                }, false, true)
            ]
        ),
        new ViewOptionGroup(
            'Options',
            [
                new ViewOption('Remove pal', () => {
                    this.removePal();
                }, true, false, () => {
                    return this.user.isPal(this.selectedUser._id);
                }, 'Click again to remove pal'),
                new ViewOption('Accept request', () => {
                    this.handleRequest(true);
                }, false, false, () => {
                    return this.user.hasRequestFrom(this.selectedUser._id) && !this.user.isPal(this.selectedUser._id);
                }),
                new ViewOption('Refuse request', () => {
                    this.handleRequest(false);
                }, false, false, () => {
                    return this.user.hasRequestFrom(this.selectedUser._id) && !this.user.isPal(this.selectedUser._id);
                }),
                new ViewOption('Cancel request', () => {
                    this.cancelRequest();
                }, false, false, () => {
                    return this.selectedUser.hasRequestFrom(this.user._id) && !this.user.isPal(this.selectedUser._id);
                }),
                new ViewOption('Send request', () => {
                    this.sendRequest();
                }, false, false, () => {
                    return !this.user.hasRequestFrom(this.selectedUser._id) &&
                        !this.user.isPal(this.selectedUser._id) &&
                        !this.selectedUser.hasRequestFrom(this.user._id);
                })
            ],
            () => {
                return this.selectedUser !== null;
            }
        )
    ];

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

    setLanguageFilter(language) {
        let me = this;
        let msg = language.name === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.language = language.name;

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
            this.notificationEmitter.emit(new Notification(ENotification.Success, msg));
        };
        this.find(displayMsg);
    }

    viewList() {
        this.selectedUser = null;
        this.view = 'discover';
        this.findFilter.pals = false;
        this.find();
    }

    view(category) {
        if (this.transacting) {
            return;
        }

        this.transacting = true;

        this.view = category;

        this.userService.getPals().then((users: User[]) => {
            this.userList = users;
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

    viewSentRequests() {
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

        if (!this.removeWarning) {
            this.removeWarning = true;
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
