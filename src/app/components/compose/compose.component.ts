import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Postcard} from '../../models/postcard/postcard';
import {PostcardService} from '../../services/postcard.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {Notif} from '../home/home.component';
import {AuthenticationService} from '../../services/authentication.service';
import {GoogleMapService} from "../../services/google-map.service";

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
    @Output() notifEvent: EventEmitter<Notif> = new EventEmitter<Notif>();
    user: User;
    recipients: User[];
    transacting = false;
    form: FormGroup;
    composeMode = false;
    shownSide = 'front';
    sendWarning = false;
    selectedOption = '';
    templates = ['none', 'bubble'];

    constructor(private postcardService: PostcardService,
                private authenticationService: AuthenticationService,
                private userService: UserService,
                private googleMapService: GoogleMapService) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().then((user: User) => {
            this.userService.getPals().then((pals: User[]) => {
                this.user = user;
                this.recipients = pals;

                this.form = new FormGroup({
                    body: new FormControl(null, Validators.required),
                    imageUrl: new FormControl(null),
                    imageFitType: new FormControl('contain'),
                    spotifyLink: new FormControl(null),
                    youtubeLink: new FormControl(null),
                    uploadedImage: new FormControl(null),
                    allowShare: new FormControl(false),
                    template: new FormControl('none'),
                    recipient: new FormControl(null, Validators.required),
                    location: new FormControl(null)
                });
            });
        });
    }

    get selectedRecipientName() {
        let recipientName = null;
        let selectedRecipientId = this.form.get('recipient').value;

        this.recipients.forEach((item) => {
            if (item._id === selectedRecipientId) {
                recipientName = item.name;
                return false;
            }
        });

        return recipientName;
    }

    get imageUrl() {
        return this.form.get('imageUrl').value || this.form.get('uploadedImage').value || null;
    }

    get headers () {
        return {'Authorization' : 'Bearer ' + this.authenticationService.getToken()};
    }

    get geoData() {
        return {
            lat: this.form.get('location').value.lat,
            lng: this.form.get('location').value.lng
        };
    }

    isBackSideOptionAvailable(option) {
        let isAvailable = true;
        let backSideOptions = [
            'youtubeLink',
            'imageUrl',
            'uploadedImage',
            'location'
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

    removeOptionValue(option, inputElement?: HTMLInputElement) {
        this.form.get(option).reset();

        if (inputElement) {
            inputElement = null;
        }

        if (option === 'template') {
            this.setTemplate('none');
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

    onLocationChange(value) {
        this.googleMapService.getGeoData(value).then((geo) => {
            let location = geo.data[0].geometry.location;
            this.form.get('location').setValue({lat: location.lat, lng: location.lng});
        });
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

    setRecipient(recipient: User) {
        this.form.get('recipient').setValue(recipient._id);
    }

    setTemplate(templateName, bodyElement = null, backElement = null) {
        bodyElement = bodyElement || document.getElementById('body');
        backElement = backElement || document.getElementById('back');

        this.form.get('template').setValue(templateName);
        console.log(this.form.get('template').value);
        if (templateName !== 'none') {

            bodyElement.style.background = 'url(../../../assets/' + templateName + '-template_front.png)';
            bodyElement.style.backgroundRepeat = 'no-repeat';
            bodyElement.style.backgroundSize = 'cover';
            bodyElement.style.backgroundPosition = 'center';

            backElement.style.background = 'url(../../../assets/' + templateName + '-template_back.png)';
            backElement.style.backgroundRepeat = 'no-repeat';
            backElement.style.backgroundSize = 'cover';
            backElement.style.backgroundPosition = 'center';
        } else {
            bodyElement.style.background = '';
            backElement.style.background = '';
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

    onImageUploadFinished(data) {
        let imageData = JSON.parse(data.serverResponse._body).data;
        let imageUrl = imageData.imageUrl;
        this.form.get('uploadedImage').setValue(imageUrl);
    }

    onImageRemoved() {
        this.form.get('uploadedImage').reset();
    }

    submit() {
        if (this.transacting) {
            return;
        }

        if (!this.sendWarning) {
            this.sendWarning = true;
            return;
        }


        let postcard = new Postcard(
            null,
            this.form.get('body').value,
            this.form.get('imageUrl').value,
            this.form.get('uploadedImage').value,
            this.form.get('imageFitType').value,
            this.form.get('spotifyLink').value,
            this.getYoutubeLinkId(),
            this.form.get('allowShare').value,
            this.form.get('template').value,
            this.form.get('recipient').value,
        );

        this.transacting = true;

        this.postcardService.create(postcard).then(() => {
            this.form.reset();
            this.composeMode = false;
            this.transacting = false;
            this.notifEvent.emit({type: 'success', msg: 'Postcard sent'});
        });
    }
}
