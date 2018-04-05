import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Postcard} from '../../models/postcard/postcard';
import {PostcardService} from '../../services/postcard.service';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
    form: FormGroup;
    composeMode = false;

    constructor(private postcardService: PostcardService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            body: new FormControl(null, Validators.required),
        });
    }

    enterComposeMode() {
        this.composeMode = true;
    }

    submit() {
        let postcard = new Postcard(
            null,
            this.form.get('body').value
        );

        this.postcardService.create(postcard).then((postcard: Postcard) => {
            this.form.reset();
            this.composeMode = false;
        });
    }
}
