import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/user/user';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {Notif} from '../home/home.component';
import {UtilService} from '../../services/util.service';
import {BaseViewComponent} from '../base-view/base-view.component';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {ViewOption} from '../../models/options/view-option';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss', '../base-view/base-view.component.scss']
})
export class AccountComponent extends BaseViewComponent implements OnInit {
    @Output() notifEvent: EventEmitter<Notif> = new EventEmitter<Notif>();
    user: User;
    form: FormGroup;
    deleteWarning = false;
    selectedOption = '';
    countryList;
    languageList;
    transacting = false;
    optionGroups = [
        new ViewOptionGroup(
            'Options',
            [
                new ViewOption('Logout', () => {
                    this.logout();
                }),
                new ViewOption('Close account', () =>  {
                    this.deleteAccount();
                }, true, 'Click again to close account')
            ]
        )
    ];

    constructor(private userService: UserService,
                private utilService: UtilService,
                private authenticationService: AuthenticationService,
                private notificationService: NotificationsService) {
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
        });
    }

    save() {
        this.transacting = true;
        this.user.showPicture = this.form.get('showPicture').value;
        this.user.showName = this.form.get('showName').value;
        this.user.enableEmailNotifications = this.form.get('enableEmailNotifications').value;
        this.user.language = this.form.get('language').value;
        this.user.country = this.form.get('country').value;
        this.user.description = this.form.get('description').value;

        this.userService.update(this.user).then((user: User) => {
            this.notifEvent.emit({type: 'success', msg: 'Profile updated'});
            this.transacting = false;
        });
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    setCountry(country) {
        this.form.get('country').setValue(country);
    }

    setLanguage(language) {
        this.form.get('language').setValue(language.name);
    }

    logout() {
        this.authenticationService.signOut();
    }

    deleteAccount() {
        this.userService.remove().then(success => {
            if (success) {
                this.notificationService.success('Account deleted');
                this.authenticationService.signOut();
            }
        });
    }


}
