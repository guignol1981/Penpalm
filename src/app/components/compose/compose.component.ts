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
            allowShare: new FormControl(false),
            template: new FormControl(),
        });
    }

    isBackSideOptionAvailable(option) {
        let isAvailable = true;
        let backSideOptions = [
            'youtubeLink',
            'imageUrl'
        ];

        backSideOptions.forEach((item) => {
            if (this.form.get(item).value && option !== item) {
                isAvailable = false;
                return false;
            }
        });

        return isAvailable;
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    removeOptionValue(option) {
        this.form.get(option).reset();
        if (option === 'template') {
            this.setTemplate('none', null);
        }
    }

    getYoutubeLinkId() {
        let link = this.form.get('youtubeLink').value;

        if (!link) {
            return null;
        }

        function youtube_parser(url) {
            let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            let match = url.match(regExp);
            return (match && match[7].length === 11) ? match[7] : false;
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
            default:
                return cssClass += ' postcard__image--none';
        }
    }

    setTemplate(templateName, bodyElement) {
        bodyElement = bodyElement || document.getElementById('body');

        if (templateName !== 'none') {
            this.form.get('template').setValue(templateName);
            bodyElement.style.background = 'url(../../../assets/' + templateName + '-template.png)';
            bodyElement.style.backgroundRepeat = 'no-repeat';
            bodyElement.style.backgroundSize = 'cover';
            bodyElement.style.backgroundPosition = 'center';
        } else {
            this.form.get('template').reset();
            bodyElement.style.background = '';
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
            this.form.get('imageFitType').value,
            this.form.get('spotifyLink').value,
            this.getYoutubeLinkId(),
            this.form.get('allowShare').value,
            this.form.get('template').value
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
