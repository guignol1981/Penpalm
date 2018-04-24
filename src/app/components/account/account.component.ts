import {Component, Input, OnInit, ViewChild} from '@angular/core';
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


@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss', '../base-view/base-view.component.scss']
})
export class AccountComponent extends BaseViewComponent implements OnInit {
    @Input() user: User;
    form: FormGroup;

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    displayImageUploader = false;

    countryList;
    languageList;

    transacting = false;

    optionGroups: ViewOptionGroup[];
    actions: ViewAction[];

    croppedImage = null;

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

    fileChangeListener(event) {
        let image: any = new Image();
        let file: File = event.target.files[0];
        let myReader: FileReader = new FileReader();
        let me = this;

        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            me.cropper.setImage(image);
            me.croppedImage = image;
        };

        myReader.readAsDataURL(file);
    }


    async save() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;

        let photoData = await this.imageService.upload(ImageService.dataURLtoFile(this.croppedImage.image, 'image'));

        this.user.name = this.form.get('name').value;
        this.user.photoData = photoData;
        this.user.enableEmailNotifications = this.form.get('enableEmailNotifications').value;
        this.user.language = this.form.get('language').value;
        this.user.country = this.form.get('country').value;
        this.user.description = this.form.get('description').value;

        this.userService.update(this.user).then((user: User) => {
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
