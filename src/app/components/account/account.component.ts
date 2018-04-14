import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/user/user';
import {AuthenticationService} from '../../services/authentication.service';
import {NotificationsService} from 'angular2-notifications';
import {Notif} from '../home/home.component';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    @Output() notifEvent: EventEmitter<Notif> = new EventEmitter<Notif>();
    user: User;
    form: FormGroup;
    deleteWarning = false;
    selectedOption = '';
    countryList;
    languageList;

    constructor(private userService: UserService,
                private utilService: UtilService,
                private authenticationService: AuthenticationService,
                private notificationService: NotificationsService) {
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
        this.user.showPicture = this.form.get('showPicture').value;
        this.user.showName = this.form.get('showName').value;
        this.user.enableEmailNotifications = this.form.get('enableEmailNotifications').value;
        this.user.language = this.form.get('language').value;
        this.user.country = this.form.get('country').value;
        this.user.description = this.form.get('description').value;

        this.userService.update(this.user).then((user: User) => {
            this.notifEvent.emit({type: 'success', msg: 'Profile updated'});
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
        if (!this.deleteWarning) {
            this.deleteWarning = true;
            return;
        }

        this.userService.remove().then(success => {
            if (success) {
                this.notificationService.success('Account deleted');
                this.authenticationService.signOut();
            }
        });
    }


}
