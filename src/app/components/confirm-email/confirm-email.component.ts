import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
    transacting = false;
    emailVerified = null;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
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

    }

}
