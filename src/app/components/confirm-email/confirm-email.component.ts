import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
    transacting = false;
    emailVerified = null;
    verificationEmailSent = false;
    form: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email])
        });

        this.transacting = true;

        this.activatedRoute.params.subscribe(params => {
            let link = params['link'];

            this.userService.verifyEmail(link).then((success) => {
                this.transacting = false;
                this.emailVerified = success;
            });
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    sendVerificationEmail() {
        if (!this.form.valid) {
            return;
        }

        this.transacting = true;

        this.userService.sendVerificationEmail(this.form.get('email').value).then(success => {
            this.transacting = false;
            this.verificationEmailSent = true;
        });
    }

}
