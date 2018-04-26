import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

export interface Credential {
    email: string;
    password: string;
}

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
    @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    form: FormGroup;
    transacting = false;

    constructor(private userService: UserService,
                private router: Router) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    cancel() {
        this.closeEvent.emit(true);
    }

    signIn() {
        if (!this.form.valid) {
            return;
        }

        this.transacting = true;

        this.userService.localSignIn(this.form.value).then(success => {
            this.transacting = false;

            if (success) {
                this.router.navigate(['/home']);
            }
        });
    }

}
