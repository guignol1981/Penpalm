import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EBackSideOption, Postcard} from '../../models/postcard/postcard';
import {PostcardService} from '../../services/postcard.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {AuthenticationService} from '../../services/authentication.service';
import {GoogleMapService} from '../../services/google-map.service';
import {SingleInput} from '../../models/single-input/single-input';
import {ESingleInput} from '../../models/single-input/e-single-input.enum';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {ViewAction} from '../../models/actions/view-action';
import {EViewAction} from '../../models/actions/e-view-action.enum';
import {ViewOption} from '../../models/options/view-option';
import {BaseViewComponent} from '../base-view/base-view.component';
import {UtilService} from '../../services/util.service';
import {ComposeViewData} from '../../models/view-data/compose-view-data';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss', '../base-view/base-view.component.scss']
})
export class ComposeComponent extends BaseViewComponent implements OnInit {
    user: User;
    recipients: User[];
    transacting = false;
    form: FormGroup;
    composeMode = false;
    shownSide = 'front';
    sendWarning = false;
    selectedOption = '';
    templates: string[];
    postcard = new Postcard();
    eBackSideOption = EBackSideOption;
    inputs: SingleInput[];
    optionGroups: ViewOptionGroup[];
    actions: ViewAction[];

    constructor(private postcardService: PostcardService,
                private authenticationService: AuthenticationService,
                private userService: UserService,
                private utilService: UtilService,
                private googleMapService: GoogleMapService) {
        super();
    }

    ngOnInit() {
        this.utilService.getCardTemplates().then((templates) => {
            this.templates = templates;
        });

        this.userService.getCurrentUser().then((user: User) => {
            this.userService.find({country: 'none', language: 'none', type: 'pals'}).then((pals: User[]) => {
                this.user = user;
                this.recipients = pals;

                this.optionGroups = ComposeViewData.getOptions(this);
                this.inputs = ComposeViewData.getInputs(this);
                this.actions = ComposeViewData.getActions(this);
            });
        });

    }

    clearInput(inputName) {
        this.inputs.forEach(item => {
            if (item.label === inputName) {
                item.value = null;
                item.lovValue = null;
            }
        });
    }

    get selectedRecipientName() {
        let recipientName = null;
        let selectedRecipientId = this.postcard.recipient;

        if (!selectedRecipientId) {
            return '';
        }

        this.recipients.forEach((item) => {
            if (item._id === selectedRecipientId) {
                recipientName = item.name;
                return false;
            }
        });

        return recipientName;
    }

    get imageUrl() {
        if (this.postcard.backSideOptionType === EBackSideOption.LinkImage ||
            this.postcard.backSideOptionType === EBackSideOption.UploadImage) {
            return this.postcard.backSideValue;
        }
        return null;
    }

    get dateNow() {
        return Date.now();
    }

    get geoData() {
        return {
            lat: this.postcard.backSideValue.value.lat,
            lng: this.postcard.backSideValue.value.lng
        };
    }

    isBackSideOptionAvailable(backSideOptionType: EBackSideOption): boolean {
        return this.postcard.backSideOptionType === backSideOptionType || this.postcard.backSideOptionType === EBackSideOption.None;
    }

    removeOptionValue(option) {
        this.form.get(option).reset();

        if (option === 'location') {
            let input = document.getElementById('location') as HTMLInputElement;
            input.value = null;
        }

        if (option === 'template') {
            this.setTemplate('none');
        }
    }

    getYoutubeLink(value) {
        let link = value;

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

    setTemplate(templateName, bodyElement = null, backElement = null) {
        bodyElement = bodyElement || document.getElementById('body');
        backElement = backElement || document.getElementById('back');

        this.form.get('template').setValue(templateName);

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

    flip() {
        let postcard = document.getElementById('postcard');

        this.selectedOption = null;
        if (this.shownSide === 'front') {
            this.shownSide = 'back';
            postcard.style.transform = 'rotateY(180deg)';
        } else {
            this.shownSide = 'front';
            postcard.style.transform = 'rotateY(0deg)';
        }
    }

    compose() {
        this.selectedOption = 'compose';
    }

    selectWYSIWYGCommand(command) {

        if (command === 'h1' || command === 'h2' || command === 'p') {
            document.execCommand('formatBlock', false, command);
        } else if (command === 'forecolor' || command === 'backcolor') {
            document.execCommand(command, false, 'red');
        } else {
            document.execCommand(command, false, null);
        }
    }

    submit(editor: HTMLElement) {
        // if (this.transacting) {
        //     return;
        // }
        //
        // if (!this.sendWarning) {
        //     this.sendWarning = true;
        //     return;
        // }
        //
        // let postcard = new Postcard(
        //     null,
        //     editor.innerHTML,
        //     this.form.get('imageUrl').value,
        //     this.form.get('uploadedImage').value,
        //     this.form.get('imageFitType').value,
        //     this.form.get('spotifyLink').value,
        //     this.getYoutubeLink(),
        //     this.form.get('allowShare').value,
        //     this.form.get('template').value,
        //     this.form.get('location').value,
        //     this.form.get('recipient').value,
        // );
        //
        // this.transacting = true;
        //
        // this.postcardService.create(postcard).then(() => {
        //     this.form.reset();
        //     this.composeMode = false;
        //     this.transacting = false;
        //     // this.notifEvent.emit({type: 'success', msg: 'Postcard sent'});
        // });
    }
}
