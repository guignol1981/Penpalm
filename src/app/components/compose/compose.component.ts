import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {EBackSideOption, Postcard} from '../../models/postcard/postcard';
import {PostcardService} from '../../services/postcard.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user/user';
import {SingleInput} from '../../models/single-input/single-input';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {ViewAction} from '../../models/actions/view-action';
import {BaseViewComponent} from '../base-view/base-view.component';
import {UtilService} from '../../services/util.service';
import {ComposeViewData} from '../../models/view-data/compose-view-data';
import {EPostcardMode, PostcardComponent} from '../postcard/postcard.component';
import {ENotification} from '../../models/notification/e-notification.enum';
import {Notification} from '../../models/notification/notification';
import {ImageService} from '../../services/image.service';
import {ImageUploadEvent} from '../uploader-modal/uploader-modal.component';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss', '../base-view/base-view.component.scss']
})
export class ComposeComponent extends BaseViewComponent implements OnInit {
    @ViewChild(PostcardComponent)
    postcardComponent: PostcardComponent;
    @Output() imageUploadEvent: EventEmitter<ImageUploadEvent> = new EventEmitter<ImageUploadEvent>();
    uploadedImage = null;
    user: User;
    recipients: User[];
    transacting = false;
    selectedOption = 'compose';
    templates: string[];
    postcard = new Postcard();
    ePostcardMode = EPostcardMode;
    inputs: SingleInput[];
    optionGroups: ViewOptionGroup[];
    actions: ViewAction[];
    shownSide = 'front';

    constructor(private postcardService: PostcardService,
                private userService: UserService,
                public imageService: ImageService,
                private utilService: UtilService) {
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

    isBackSideOptionAvailable(backSideOptionType: EBackSideOption): boolean {
        return this.postcard.backSideOptionType === backSideOptionType || this.postcard.backSideOptionType === EBackSideOption.None;
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

    onComposeMode(bool) {
        if (bool) {
            this.selectedOption = 'compose';
        }
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

    flipPostcard() {
        if (this.shownSide === 'front') {
            this.shownSide = 'back';
        } else {
            this.shownSide = 'front';
        }

        this.postcardComponent.flip();
    }

    async submit(action: ViewAction) {
        if (this.transacting) {
            return;
        }

        if (this.uploadedImage) {
            this.postcard.backSideValue = await this.imageService.upload(this.uploadedImage);
            this.postcard.backSideOptionType = EBackSideOption.UploadImage;
        }

        this.postcard.body = this.postcardComponent.getBody();
        this.transacting = true;

        this.postcardService.create(this.postcard).then(() => {
            action.warned = false;
            this.postcard = new Postcard();
            this.postcardComponent.setPostcard(this.postcard);
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Postcard sent'));
            this.transacting = false;
        });
    }
}
