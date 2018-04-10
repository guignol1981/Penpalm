import {Component, Input, OnInit} from '@angular/core';
import {Preference} from '../../models/user/preference';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from "../../models/user/user";
import {AuthenticationService} from "../../services/authentication.service";
import {NotificationsService} from "angular2-notifications";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    @Input() user: User;
    form: FormGroup;
    deleteWarning = false;
    selectedOption = '';
    shownSide = 'front';

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            displayPicture: new FormControl(this.user.preferences.displayPicture),
            displayName: new FormControl(this.user.preferences.displayName),
            emailNotifications: new FormControl(this.user.preferences.emailNotifications),
            findable: new FormControl(this.user.preferences.findable)
        });
    }

    save() {
        this.user.preferences.displayPicture = this.form.get('displayPicture').value;
        this.user.preferences.displayName = this.form.get('displayName').value;
        this.user.preferences.emailNotifications = this.form.get('emailNotifications').value;

        this.userService.update(this.user).then((user: User) => {
            this.notificationService.success('Preferences saved');
        });
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    logout() {
        this.authenticationService.signOut();
    }

    deleteAccount() {
        if (!this.deleteWarning) {
            this.deleteWarning = true;
            return;
        }

        this.userService.remove(this.user).then(success => {
            if (success) {
                this.notificationService.success('Account deleted');
                this.authenticationService.signOut();
            }
        });
    }


}
