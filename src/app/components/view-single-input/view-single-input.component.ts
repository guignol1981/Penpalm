import {Component, Input, OnInit} from '@angular/core';
import {LovItem, SingleInput} from '../../models/single-input/single-input';

@Component({
    selector: 'app-view-single-input',
    templateUrl: './view-single-input.component.html',
    styleUrls: ['./view-single-input.component.scss']
})
export class ViewSingleInputComponent implements OnInit {
    @Input() inputs: SingleInput[];

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

    setValue(singleInput: SingleInput, value: LovItem) {
        singleInput.value = value;
        this.executeInput(singleInput);
    }

    executeInput(singleInput: SingleInput) {
        singleInput.callback(singleInput);
    }

}
