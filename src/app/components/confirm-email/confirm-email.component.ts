import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
    success;
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe( params => {
            let link = params['link'];
            this.userService.verifyEmail(link).then((success) => {
                this.success = success;
            });
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

}
