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
    success;

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

    close() {
        this.closeEvent.emit(true);
    }

    register() {
        if (!this.form.valid) {
            return;
        }

        this.userService.register(this.form.value).then((success) => {
            this.success = success;
        });
    }

}
