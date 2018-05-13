import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LovItem, SingleInput} from '../../models/single-input/single-input';
import {ESingleInput} from '../../models/single-input/e-single-input.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {GoogleMapService} from '../../services/google-map.service';
import {ImageService} from '../../services/image.service';
import {ELoader} from '../loader/loader.component';
import {CropperSettings, ImageCropperComponent} from 'ngx-img-cropper';

@Component({
    selector: 'app-view-single-input',
    templateUrl: './view-single-input.component.html',
    styleUrls: ['./view-single-input.component.scss']
})
export class ViewSingleInputComponent implements OnInit {
    @Input() inputs: SingleInput[];
    eSingleInput = ESingleInput;
    formattedAddress = '';
    showLoader = false;
    eLoader = ELoader;

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    cropperSettings: CropperSettings;

    constructor(private googleMapService: GoogleMapService) {
    }

    ngOnInit() {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.noFileInput = true;
    }

    onLocationChange(singleInput: SingleInput, value) {
        this.googleMapService.getGeoData(value).then((geo) => {
            let location = geo.data[0].geometry.location;
            this.formattedAddress = geo.data[0].formatted_address;
            this.setValue(singleInput, {lat: location.lat, lng: location.lng});
        });
    }

    checkCondition(singleInput: SingleInput): boolean {
        if (singleInput.condition) {
            return singleInput.condition();
        } else {
            return true;
        }
    }

    setLovValue(singleInput: SingleInput, value: LovItem) {
        console.log(value);
        singleInput.lovValue = value;
        this.executeInput(singleInput);
    }

    setValue(singleInput: SingleInput, value: any) {
        singleInput.value = value;
        this.executeInput(singleInput);
    }

    setBoolValue(singleInput: SingleInput, value: boolean) {
        singleInput.boolValue = value;
        this.executeInput(singleInput);
    }

    executeInput(singleInput: SingleInput) {
        singleInput.callback(singleInput);
    }

}
