import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../../validators/password-validator';


@Component({
    selector: 'app-register-modal',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {
    @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    form: FormGroup;
    view = 'form';
    transacting = false;
    errorMsg: string;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            username: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            passwordConfirm: new FormControl(null)
        }, PasswordValidator.MatchPassword);
    }

    get username() {
        return this.form.get('username');
    }

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

    get passwordConfirm() {
        return this.form.get('passwordConfirm');
    }


    close() {
        this.closeEvent.emit(true);
    }

    register() {
        if (!this.form.valid) {
            return;
        }

        this.transacting = true;

        this.userService.register(this.form.value)
            .then(result => {
                console.log(result);
                this.transacting = false;
                if (result === true) {
                    this.view = 'success';
                }
            })
            .catch(reason => {
                this.transacting = false;
                this.errorMsg = reason;
            });
    }

}
