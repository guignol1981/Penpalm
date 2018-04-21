import {Component, Input, OnInit} from '@angular/core';
import {LovItem, SingleInput} from '../../models/single-input/single-input';
import {ESingleInput} from '../../models/single-input/e-single-input.enum';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
    selector: 'app-view-single-input',
    templateUrl: './view-single-input.component.html',
    styleUrls: ['./view-single-input.component.scss']
})
export class ViewSingleInputComponent implements OnInit {
    @Input() inputs: SingleInput[];
    eSingleInput = ESingleInput;

    constructor(private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
    }

    get headers() {
        return {'Authorization': 'Bearer ' + this.authenticationService.getToken()};
    }


    onUploadFinished(singleInput: SingleInput, data) {
        let imageData = JSON.parse(data.serverResponse._body).data;
        let imageUrl = imageData.imageUrl;
        this.setValue(singleInput, imageUrl);
    }

    onUploadRemoved(singleInput: SingleInput) {
        this.setValue(singleInput, null);
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

    setValue(singleInput: SingleInput, value: string) {
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
