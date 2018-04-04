import {Component, Input, OnInit} from '@angular/core';
import {Preference} from '../../models/user/preference';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from "../../models/user/user";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    @Input() user: User;
    form: FormGroup;

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        console.log(this.user);
        this.form = new FormGroup({
            displayImage: new FormControl(this.user.preferences.displayImage),
            displayName: new FormControl(this.user.preferences.displayName),
            emailNotifications: new FormControl(this.user.preferences.emailNotifications)
        });
    }

    save() {
        this.user.preferences.displayImage = this.form.get('displayImage').value;
        this.user.preferences.displayName = this.form.get('displayName').value;
        this.user.preferences.emailNotifications = this.form.get('emailNotifications').value;

        this.userService.update(this.user).then((user: User) => {

        });
    }

    logout() {
        this.authenticationService.signOut();
    }

    deleteAccount() {

    }


}
