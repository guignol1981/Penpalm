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
    sendWarning = false;
    selectedOption = '';

    constructor(private postcardService: PostcardService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            body: new FormControl(null, Validators.required),
            imageUrl: new FormControl(null),
            imageFitType: new FormControl('contain'),
            spotifyLink: new FormControl(null),
            youtubeLink: new FormControl(null),
            allowShare: new FormControl(false)
        });
    }

    enterComposeMode() {
        this.composeMode = true;
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    getYoutubeLinkId() {
        let link = this.form.get('youtubeLink').value;

        function youtube_parser(url){
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
        }

        return youtube_parser(link);
    }

    getImageClass() {
        let cssClass = 'postcard__image';
        switch (this.form.get('imageFitType').value) {
            case 'contain':
                return cssClass += ' postcard__image--contain';
            case 'cover':
                return cssClass += ' postcard__image--cover';
            case 'fill':
                return cssClass += ' postcard__image--fill';
            case 'none':
                return cssClass += ' postcard__image--none';
        }
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
        if (!this.sendWarning) {
            this.sendWarning = true;
            return;
        }

        if (this.sending) {
            return;
        }

        let postcard = new Postcard(
            null,
            this.form.get('body').value,
            this.form.get('imageUrl').value,
            this.form.get('imageFitType').value
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
