import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/user/user';
import {AuthenticationService} from '../../services/authentication.service';
import {UtilService} from '../../services/util.service';
import {BaseViewComponent} from '../base-view/base-view.component';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {ViewAction} from '../../models/actions/view-action';
import {Notification} from '../../models/notification/notification';
import {ENotification} from '../../models/notification/e-notification.enum';
import {AccountViewData} from '../../models/view-data/account-view-data';
import {ImageService} from '../../services/image.service';
import {ImageCropperComponent, CropperSettings} from 'ngx-img-cropper';
import {ImageUploadEvent} from '../uploader-modal/uploader-modal.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss', '../base-view/base-view.component.scss']
})
export class AccountComponent extends BaseViewComponent implements OnInit {
    @Input() user: User;
    @Output() imageUploadEvent: EventEmitter<ImageUploadEvent> = new EventEmitter<ImageUploadEvent>();
    form: FormGroup;

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    countryList;
    languageList;

    transacting = false;

    optionGroups: ViewOptionGroup[];
    actions: ViewAction[];

    profilePicture = null;

    cropperSettings: CropperSettings;

    constructor(private userService: UserService,
                private utilService: UtilService,
                private imageService: ImageService,
                private authenticationService: AuthenticationService) {
        super();
    }

    ngOnInit() {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.noFileInput = true;

        this.utilService.getCountries().then((countries) => {
            this.countryList = countries;
        });

        this.utilService.getLanguages().then((languages) => {
            this.languageList = languages;
        });

        this.form = new FormGroup({
            name: new FormControl(this.user.name),
            enableEmailNotifications: new FormControl(this.user.enableEmailNotifications),
            language: new FormControl(this.user.language),
            country: new FormControl(this.user.country),
            description: new FormControl(this.user.description)
        });

        this.optionGroups = AccountViewData.getOptions(this);
        this.actions = AccountViewData.getActions(this);
    }

    uploadImage() {
        let me = this;
        let event: ImageUploadEvent = {
            callback: file => {
                me.profilePicture = file;
            }
        };

        this.imageUploadEvent.emit(event);
    }

    removeImage() {
        this.profilePicture = null;
    }


    async save() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;

        if (this.user.photoData.cloudStorageObject && this.profilePicture) {
            await this.imageService.remove(this.user.photoData.cloudStorageObject);
            this.user.photoData = null;
        }

        if (this.profilePicture) {
            this.user.photoData = await this.imageService.upload(this.profilePicture);
        }

        this.user.name = this.form.get('name').value;
        this.user.enableEmailNotifications = this.form.get('enableEmailNotifications').value;
        this.user.language = this.form.get('language').value;
        this.user.country = this.form.get('country').value;
        this.user.description = this.form.get('description').value;

        this.userService.update(this.user).then((user: User) => {
            this.profilePicture = null;
            this.user = user;
            this.transacting = false;
            this.notificationEmitter.emit(new Notification(ENotification.Success, 'Profile saved'));
        });
    }

    setCountry(country) {
        this.form.get('country').setValue(country);
    }

    setLanguage(language) {
        this.form.get('language').setValue(language);
    }

    logout() {
        if (this.transacting) {
            return;
        }

        this.authenticationService.signOut();
    }

    deleteAccount() {
        if (this.transacting) {
            return;
        }

        this.userService.remove().then(success => {
            this.transacting = false;
            if (success) {
                this.authenticationService.signOut();
            }
        });
    }


}
