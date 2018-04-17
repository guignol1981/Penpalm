import {Component, Input, OnInit} from '@angular/core';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {ViewOption} from '../../models/options/view-option';

@Component({
    selector: 'app-view-options',
    templateUrl: './view-options.component.html',
    styleUrls: ['./view-options.component.scss']
})
export class ViewOptionsComponent implements OnInit {
    @Input() groups: ViewOptionGroup[];
    @Input() disableOptions: boolean;

    constructor() {
    }

    ngOnInit() {
        console.log(this.groups);
    }

    getOptionName(option: ViewOption) {
        if (option.warned) {
            return option.warnMsg;
        }
        return option.name;
    }

    executeOption(option: ViewOption) {
        if (this.disableOptions) {
            return;
        }

        if (option.shouldWarn && !option.warned) {
            option.warned = true;
            return;
        }
        option.callback();
    }

}
