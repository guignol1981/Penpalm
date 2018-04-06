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
    shownSide = 'front';
    sending = false;

    constructor(private postcardService: PostcardService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            body: new FormControl(null, Validators.required),
            imageUrl: new FormControl(null)
        });
    }

    enterComposeMode() {
        this.composeMode = true;
    }

    flip(postcard) {
        if (this.shownSide === 'front') {
            this.shownSide = 'back';
            postcard.style.transform = 'rotateY(180deg)';
        } else {
            this.shownSide = 'front';
            postcard.style.transform = 'rotateY(0deg)';
        }
    }

    submit() {
        if (this.sending) {
            return;
        }

        let postcard = new Postcard(
            null,
            this.form.get('body').value,
            this.form.get('imageUrl').value
        );
        this.sending = true;
        this.postcardService.create(postcard).then((postcard: Postcard) => {
            this.form.reset();
            this.composeMode = false;
            this.notificationService.success('Postcard sent');
            this.sending = false;
        });
    }
}
