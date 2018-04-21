import {Component, Input, OnInit} from '@angular/core';
import {LovItem, SingleInput} from '../../models/single-input/single-input';
import {ESingleInput} from '../../models/single-input/e-single-input.enum';

@Component({
    selector: 'app-view-single-input',
    templateUrl: './view-single-input.component.html',
    styleUrls: ['./view-single-input.component.scss']
})
export class ViewSingleInputComponent implements OnInit {
    @Input() inputs: SingleInput[];
    eSingleInput = ESingleInput;

    constructor() {
    }

    ngOnInit() {
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

    executeInput(singleInput: SingleInput) {
        singleInput.callback(singleInput);
    }

}
