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

    constructor(private postcardService: PostcardService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            body: new FormControl(null, Validators.required),
        });
    }

    submit() {
        let postcard = new Postcard(
            null,
            this.form.get('body').value
       );

        this.postcardService.create(postcard).then((postcard: Postcard) => {
            console.log('ok');
        });
    }
}
