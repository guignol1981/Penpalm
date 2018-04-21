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

                this.initActions();
                this.initOptions();
                this.initInputs();
            });
        });

    }


    initActions() {
        this.actions = [
            new ViewAction(
                'Flip',
                () => {
                    this.flip();
                },
                EViewAction.Secondary,
                false
            ),
            new ViewAction(
                'Send',
                () => {
                },
                EViewAction.Primary,
                false
            )
        ];
    }

    initOptions() {
        this.optionGroups = [
            new ViewOptionGroup(
                'General',
                [
                    new ViewOption('Recipient', () => {
                        this.selectedOption = 'recipient';
                    }, false, false, null, null, 'fas fa-user'),
                    new ViewOption('Spotify song', () => {
                        this.selectedOption = 'spotify';
                    }, false, false, () => {
                        return !this.postcard.spotifyLink;
                    }, null, 'fab fa-spotify'),
                    new ViewOption('Remove spotify song', () => {
                        this.selectedOption = null;
                        this.postcard.spotifyLink = null;
                        this.clearInput('Spotify song');
                    }, false, false, () => {
                        return !!this.postcard.spotifyLink;
                    }, null, 'fab fa-spotify'),
                    new ViewOption('Template', () => {
                        this.selectedOption = 'template';
                    }, false, false, () => {
                        return !this.postcard.template;
                    }, null, 'far fa-square'),
                    new ViewOption('Remove template', () => {
                        this.selectedOption = null;
                        this.postcard.template = null;
                        this.clearInput('Template');
                    }, false, false, () => {
                        return !!this.postcard.template;
                    }, null, 'far fa-square'),
                    new ViewOption('Allow share', () => {
                        this.selectedOption = 'allow-share';
                    }, false, false, null, null, 'fas fa-share-alt')
                ]
            ),
            new ViewOptionGroup(
                'Back side',
                [
                    new ViewOption('Youtube video', () => {
                        this.selectedOption = 'youtube';
                    }, false, false, () => {
                        return this.postcard.backSideOptionType !== EBackSideOption.Youtube;
                    }, null, 'fab fa-youtube', () => {
                        return this.isBackSideOptionAvailable(EBackSideOption.Youtube);
                    }),
                    new ViewOption('Remove youtube video', () => {
                        this.postcard.backSideOptionType = EBackSideOption.None;
                        this.postcard.backSideValue = null;
                        this.selectedOption = null;
                        this.clearInput('Youtube video');
                    }, false, false, () => {
                        return this.postcard.backSideOptionType === EBackSideOption.Youtube;
                    }, null, 'fab fa-youtube', () => {
                        return this.isBackSideOptionAvailable(EBackSideOption.Youtube);
                    }),
                    new ViewOption('Link image', () => {
                        this.selectedOption = 'image-link';
                    }, false, false, () => {
                        return this.postcard.backSideOptionType !== EBackSideOption.LinkImage;
                    }, null, 'fas fa-link', () => {
                        return this.isBackSideOptionAvailable(EBackSideOption.LinkImage);
                    }),
                    new ViewOption('Remove linked image', () => {
                        this.postcard.backSideOptionType = EBackSideOption.None;
                        this.postcard.backSideValue = null;
                        this.selectedOption = null;
                        this.clearInput('Image link');
                    }, false, false, () => {
                        return this.postcard.backSideOptionType === EBackSideOption.LinkImage;
                    }, null, 'fas fa-link', () => {
                        return this.isBackSideOptionAvailable(EBackSideOption.LinkImage);
                    }),
                    new ViewOption('Upload image', () => {
                        this.selectedOption = 'upload';
                    }, false, false, () => {
                        return this.postcard.backSideOptionType !== EBackSideOption.UploadImage;
                    }, null, 'fas fa-image', () => {
                        return this.isBackSideOptionAvailable(EBackSideOption.UploadImage);
                    }),
                    new ViewOption('Remove uploaded image', () => {
                        this.postcard.backSideOptionType = EBackSideOption.None;
                        this.postcard.backSideValue = null;
                        this.selectedOption = null;
                        this.clearInput('Upload image');
                    }, false, false, () => {
                        return this.postcard.backSideOptionType === EBackSideOption.UploadImage;
                    }, null, 'fas fa-image', () => {
                        return this.isBackSideOptionAvailable(EBackSideOption.UploadImage);
                    }),
                    new ViewOption('Location', () => {
                    }, false, false, null, null, 'fas fa-map-marker'),
                    new ViewOption('Remove location', () => {
                    }, false, false, () => {
                        return false;
                    }, null, 'fas fa-map-marker'),
                ],
                () => {
                    return this.shownSide === 'back';
                }
            )
        ];
    }

    initInputs() {
        this.inputs = [
            new SingleInput(
                'Recipient',
                ESingleInput.DropDown,
                (singleInput: SingleInput) => {
                    this.postcard.recipient = singleInput.lovValue.id;
                },
                () => {
                    return this.selectedOption === 'recipient';
                }, 'fas fa-user',
                this.recipients.map(a => {
                    return {
                        label: a.name,
                        id: a._id
                    };
                })
            ),
            new SingleInput(
                'Spotify song',
                ESingleInput.Text,
                (singleInput: SingleInput) => {
                    this.postcard.spotifyLink = singleInput.value;
                },
                () => {
                    return this.selectedOption === 'spotify';
                }, 'fab fa-spotify', null, 'Spotify uri'
            ),
            new SingleInput(
                'Template',
                ESingleInput.DropDown,
                (singleInput: SingleInput) => {
                    this.postcard.template = singleInput.lovValue.id;
                },
                () => {
                    return this.selectedOption === 'template';
                }, 'far fa-square',
                this.templates.map(a => {
                    return {
                        label: a,
                        id: a
                    };
                })
            ),
            new SingleInput(
                'Allow share',
                ESingleInput.Switch,
                (singleInput: SingleInput) => {
                    this.postcard.allowShare = singleInput.boolValue;
                },
                () => {
                    return this.selectedOption === 'allow-share';
                }, 'fas fa-share-alt'
            ),
            new SingleInput(
                'Youtube video',
                ESingleInput.Text,
                (singleInput: SingleInput) => {
                    let youtubeLink = this.getYoutubeLink(singleInput.value);
                    if (!youtubeLink) {
                        singleInput.helperMsg = 'Invalid link';
                        return;
                    }
                    singleInput.helperMsg = null;
                    this.postcard.backSideOptionType = EBackSideOption.Youtube;
                    this.postcard.backSideValue = this.getYoutubeLink(singleInput.value);
                },
                () => {
                    return this.selectedOption === 'youtube';
                }, 'fab fa-youtube', null, 'Youtube link'
            ),
            new SingleInput(
                'Image link',
                ESingleInput.Text,
                (singleInput: SingleInput) => {
                    this.postcard.backSideOptionType = EBackSideOption.LinkImage;
                    this.postcard.backSideValue = singleInput.value;
                },
                () => {
                    return this.selectedOption === 'image-link';
                }, 'fas fa-link', null, 'Image url'
            ),
            new SingleInput(
                'Upload image',
                ESingleInput.Upload,
                (singleInput: SingleInput) => {
                    this.postcard.backSideOptionType = EBackSideOption.UploadImage;
                    this.postcard.backSideValue = singleInput.value;
                },
                () => {
                    return this.selectedOption === 'upload';
                }, 'fas fa-image'
            ),
        ];
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

    get dateNow() {
        return Date.now();
    }

    get geoData() {
        return {
            lat: this.form.get('location').value.lat,
            lng: this.form.get('location').value.lng
        };
    }

    isBackSideOptionAvailable(backSideOptionType: EBackSideOption): boolean {
        return this.postcard.backSideOptionType === backSideOptionType || this.postcard.backSideOptionType === EBackSideOption.None;
    }

    selectOption(option) {
        this.selectedOption = option;
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
