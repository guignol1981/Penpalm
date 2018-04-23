import {Component, Input, OnInit} from '@angular/core';
import {LovItem, SingleInput} from '../../models/single-input/single-input';
import {ESingleInput} from '../../models/single-input/e-single-input.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {GoogleMapService} from '../../services/google-map.service';
import {ImageService} from '../../services/image.service';

@Component({
    selector: 'app-view-single-input',
    templateUrl: './view-single-input.component.html',
    styleUrls: ['./view-single-input.component.scss']
})
export class ViewSingleInputComponent implements OnInit {
    @Input() inputs: SingleInput[];
    eSingleInput = ESingleInput;
    formattedAddress = '';

    constructor(private authenticationService: AuthenticationService,
                private imageService: ImageService,
                private googleMapService: GoogleMapService) {
    }

    ngOnInit() {
    }

    get headers() {
        return {'Authorization': 'Bearer ' + this.authenticationService.getToken()};
    }


    onUploadFinished(singleInput: SingleInput, data) {
        let imageData = JSON.parse(data.serverResponse._body).data;
        this.setValue(singleInput, imageData);
    }

    onUploadRemoved(singleInput: SingleInput) {
        this.imageService.remove(singleInput.value.cloudStorageObject).then(() => {

        });
        this.setValue(singleInput, null);
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
