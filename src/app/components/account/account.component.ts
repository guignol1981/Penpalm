import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/user/user';
import {AuthenticationService} from '../../services/authentication.service';
import {UtilService} from '../../services/util.service';
import {BaseViewComponent} from '../base-view/base-view.component';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {ViewOption} from '../../models/options/view-option';
import {ViewAction} from '../../models/actions/view-action';
import {EViewAction} from '../../models/actions/e-view-action.enum';
import {Notification} from '../../models/notification/notification';
import {ENotification} from '../../models/notification/e-notification.enum';
import {AccountViewData} from '../../models/view-data/account-view-data';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss', '../base-view/base-view.component.scss']
})
export class AccountComponent extends BaseViewComponent implements OnInit {
    user: User;
    form: FormGroup;

    countryList;
    languageList;

    transacting = false;

    optionGroups: ViewOptionGroup[];
    actions: ViewAction[];

    constructor(private userService: UserService,
                private utilService: UtilService,
                private authenticationService: AuthenticationService) {
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
            this.form = new FormGroup({
                showPicture: new FormControl(this.user.showPicture),
                showName: new FormControl(this.user.showName),
                enableEmailNotifications: new FormControl(this.user.enableEmailNotifications),
                language: new FormControl(this.user.language),
                country: new FormControl(this.user.country),
                description: new FormControl(this.user.description)
            });

            this.optionGroups = AccountViewData.getOptions(this);
            this.actions = AccountViewData.getActions(this);
        });
    }

    save() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.user.showPicture = this.form.get('showPicture').value;
        this.user.showName = this.form.get('showName').value;
        this.user.enableEmailNotifications = this.form.get('enableEmailNotifications').value;
        this.user.language = this.form.get('language').value;
        this.user.country = this.form.get('country').value;
        this.user.description = this.form.get('description').value;

        this.userService.update(this.user).then((user: User) => {
            this.user = user;
            this.transacting = false;
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Profile saved'));
        });
    }

    setCountry(country) {
        this.form.get('country').setValue(country);
    }

    setLanguage(language) {
        this.form.get('language').setValue(language.name);
    }

    logout() {
        if (this.transacting) {
            return;
        }

        this.authenticationService.signOut();
    }

    deleteAccount() {
        if (this.transacting) {
            return;
        }

        this.userService.remove().then(success => {
            this.transacting = false;
            if (success) {
                this.authenticationService.signOut();
            }
        });
    }


}
