import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../../validators/password-validator';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    transacting = false;
    form: FormGroup;
    link: string;
    resetPasswordSuccess = false;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            passwordConfirm: new FormControl(null)
        }, PasswordValidator.MatchPassword);

        this.activatedRoute.params.subscribe(params => {
            this.link = params['link'];
        });
    }

    get password() {
        return this.form.get('password');
    }

    get passwordConfirm() {
        return this.form.get('passwordConfirm');
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    resetPassword() {
        if (!this.form.valid || this.transacting) {
            return;
        }

        this.transacting = true;

        this.userService.resetPassword(this.form.get('password').value, this.link)
            .then((success) => {
                this.transacting = false;
                this.resetPasswordSuccess = success;
            });

    }

}
