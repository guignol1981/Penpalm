import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Postcard} from '../../models/postcard/postcard';
import {PostcardService} from '../../services/postcard.service';
import {NotificationsService} from "angular2-notifications";

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
    form: FormGroup;
    composeMode = false;

    constructor(private postcardService: PostcardService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            body: new FormControl(null, Validators.required),
        });
    }

    enterComposeMode() {
        this.composeMode = true;
    }

    flip() {

    }

    submit() {
        let postcard = new Postcard(
            null,
            this.form.get('body').value
        );

        this.postcardService.create(postcard).then((postcard: Postcard) => {
            this.form.reset();
            this.composeMode = false;
            this.notificationService.success('Postcard sent');
        });
    }
}
