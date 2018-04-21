import {ComposeComponent} from '../../components/compose/compose.component';
import {ViewOptionGroup} from '../options/view-option-group';
import {ViewOption} from '../options/view-option';
import {EBackSideOption} from '../postcard/postcard';
import {SingleInput} from '../single-input/single-input';
import {ESingleInput} from '../single-input/e-single-input.enum';
import {ViewAction} from '../actions/view-action';
import {EViewAction} from '../actions/e-view-action.enum';

export class ComposeViewData {

    constructor() {}

    public static getOptions(composeComponent: ComposeComponent): ViewOptionGroup[] {
        return [
            new ViewOptionGroup(
                'General',
                [
                    new ViewOption('Recipient', () => {
                        composeComponent.selectedOption = 'recipient';
                    }, false, false, null, null, 'fas fa-user'),
                    new ViewOption('Spotify song', () => {
                        composeComponent.selectedOption = 'spotify';
                    }, false, false, () => {
                        return !composeComponent.postcard.spotifyLink;
                    }, null, 'fab fa-spotify'),
                    new ViewOption('Remove spotify song', () => {
                        composeComponent.selectedOption = null;
                        composeComponent.postcard.spotifyLink = null;
                        composeComponent.clearInput('Spotify song');
                    }, false, false, () => {
                        return !!composeComponent.postcard.spotifyLink;
                    }, null, 'fab fa-spotify'),
                    new ViewOption('Template', () => {
                        composeComponent.selectedOption = 'template';
                    }, false, false, () => {
                        return !composeComponent.postcard.template;
                    }, null, 'far fa-square'),
                    new ViewOption('Remove template', () => {
                        composeComponent.selectedOption = null;
                        composeComponent.postcard.template = null;
                        composeComponent.postcardComponent.setTemplate(null);
                        composeComponent.clearInput('Template');
                    }, false, false, () => {
                        return !!composeComponent.postcard.template;
                    }, null, 'far fa-square'),
                    new ViewOption('Allow share', () => {
                        composeComponent.selectedOption = 'allow-share';
                    }, false, false, null, null, 'fas fa-share-alt')
                ]
            ),
            new ViewOptionGroup(
                'Back side',
                [
                    new ViewOption('Youtube video', () => {
                        composeComponent.selectedOption = 'youtube';
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType !== EBackSideOption.Youtube;
                    }, null, 'fab fa-youtube', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.Youtube);
                    }),
                    new ViewOption('Remove youtube video', () => {
                        composeComponent.postcard.backSideOptionType = EBackSideOption.None;
                        composeComponent.postcard.backSideValue = null;
                        composeComponent.selectedOption = null;
                        composeComponent.clearInput('Youtube video');
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType === EBackSideOption.Youtube;
                    }, null, 'fab fa-youtube', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.Youtube);
                    }),
                    new ViewOption('Link image', () => {
                        composeComponent.selectedOption = 'image-link';
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType !== EBackSideOption.LinkImage;
                    }, null, 'fas fa-link', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.LinkImage);
                    }),
                    new ViewOption('Remove linked image', () => {
                        composeComponent.postcard.backSideOptionType = EBackSideOption.None;
                        composeComponent.postcard.backSideValue = null;
                        composeComponent.selectedOption = null;
                        composeComponent.clearInput('Image link');
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType === EBackSideOption.LinkImage;
                    }, null, 'fas fa-link', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.LinkImage);
                    }),
                    new ViewOption('Upload image', () => {
                        composeComponent.selectedOption = 'upload';
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType !== EBackSideOption.UploadImage;
                    }, null, 'fas fa-image', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.UploadImage);
                    }),
                    new ViewOption('Remove uploaded image', () => {
                        composeComponent.postcard.backSideOptionType = EBackSideOption.None;
                        composeComponent.postcard.backSideValue = null;
                        composeComponent.selectedOption = null;
                        composeComponent.clearInput('Upload image');
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType === EBackSideOption.UploadImage;
                    }, null, 'fas fa-image', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.UploadImage);
                    }),
                    new ViewOption('Location', () => {
                        composeComponent.selectedOption = 'location';
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType !== EBackSideOption.Location;
                    }, null, 'fas fa-map-marker', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.Location);
                    }),
                    new ViewOption('Remove location', () => {
                        composeComponent.postcard.backSideOptionType = EBackSideOption.None;
                        composeComponent.postcard.backSideValue = null;
                        composeComponent.selectedOption = null;
                        composeComponent.clearInput('location');
                    }, false, false, () => {
                        return composeComponent.postcard.backSideOptionType === EBackSideOption.Location;
                    }, null, 'fas fa-map-marker', () => {
                        return composeComponent.isBackSideOptionAvailable(EBackSideOption.Location);
                    }),
                ],
                () => {
                    return composeComponent.shownSide === 'back';
                }
            )
        ];
    }

    public static getInputs(composeComponent: ComposeComponent): SingleInput[] {
        return [
            new SingleInput(
                'Recipient',
                ESingleInput.DropDown,
                (singleInput: SingleInput) => {
                    composeComponent.postcard.recipient = singleInput.lovValue.id;
                },
                () => {
                    return composeComponent.selectedOption === 'recipient';
                }, 'fas fa-user',
                composeComponent.recipients.map(a => {
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
                    composeComponent.postcard.spotifyLink = singleInput.value;
                },
                () => {
                    return composeComponent.selectedOption === 'spotify';
                }, 'fab fa-spotify', null, 'Spotify uri'
            ),
            new SingleInput(
                'Template',
                ESingleInput.DropDown,
                (singleInput: SingleInput) => {
                    composeComponent.postcard.template = singleInput.lovValue.id;
                    composeComponent.postcardComponent.setTemplate(singleInput.lovValue.id);
                },
                () => {
                    return composeComponent.selectedOption === 'template';
                }, 'far fa-square',
                composeComponent.templates.map(a => {
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
                    composeComponent.postcard.allowShare = singleInput.boolValue;
                },
                () => {
                    return composeComponent.selectedOption === 'allow-share';
                }, 'fas fa-share-alt'
            ),
            new SingleInput(
                'Youtube video',
                ESingleInput.Text,
                (singleInput: SingleInput) => {
                    let youtubeLink = composeComponent.getYoutubeLink(singleInput.value);
                    if (!youtubeLink) {
                        singleInput.helperMsg = 'Invalid link';
                        return;
                    }
                    singleInput.helperMsg = null;
                    composeComponent.postcard.backSideOptionType = EBackSideOption.Youtube;
                    composeComponent.postcard.backSideValue = composeComponent.getYoutubeLink(singleInput.value);
                },
                () => {
                    return composeComponent.selectedOption === 'youtube';
                }, 'fab fa-youtube', null, 'Youtube link'
            ),
            new SingleInput(
                'Image link',
                ESingleInput.Text,
                (singleInput: SingleInput) => {
                    composeComponent.postcard.backSideOptionType = EBackSideOption.LinkImage;
                    composeComponent.postcard.backSideValue = singleInput.value;
                },
                () => {
                    return composeComponent.selectedOption === 'image-link';
                }, 'fas fa-link', null, 'Image url'
            ),
            new SingleInput(
                'Upload image',
                ESingleInput.Upload,
                (singleInput: SingleInput) => {
                    composeComponent.postcard.backSideOptionType = EBackSideOption.UploadImage;
                    composeComponent.postcard.backSideValue = singleInput.value;
                },
                () => {
                    return composeComponent.selectedOption === 'upload';
                }, 'fas fa-image'
            ),
            new SingleInput(
                'Location',
                ESingleInput.Location,
                (singleInput: SingleInput) => {
                    composeComponent.postcard.backSideOptionType = EBackSideOption.Location;
                    composeComponent.postcard.backSideValue = singleInput.value;
                },
                () => {
                    return composeComponent.selectedOption === 'location';
                }, 'fas fa-map-marker', null, 'Location'
            ),
        ];
    }

    public static getActions(composeComponent: ComposeComponent): ViewAction[] {
        return [
            new ViewAction(
                'Flip',
                () => {
                    composeComponent.flipPostcard();
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
}
