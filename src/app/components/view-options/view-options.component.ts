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
    selectedOption: ViewOption;

    constructor() {
    }

    ngOnInit() {
        this.groups.forEach(group => {
            group.options.forEach(option => {
                if (option.executeOnAwake) {
                    this.selectedOption = option;
                    option.callback();
                }
            });
        });
    }

    getOptionClass(option: ViewOption) {
        let cssClass = 'btn btn--align-left btn--text-md';

        if (this.disableOptions || !this.checkOptionActiveCondition(option)) {
            return cssClass += ' btn--disabled';
        }

        if (option.staySelected && this.selectedOption === option) {
            return cssClass += ' btn--active';
        }

        return cssClass;
    }

    checkGroupCondition(group: ViewOptionGroup): boolean {
        if (group.condition) {
            return group.condition();
        } else {
            return true;
        }
    }

    checkOptionCondition(option: ViewOption): boolean {
        if (option.condition) {
            return option.condition();
        } else {
            return true;
        }
    }

    checkOptionActiveCondition(option: ViewOption): boolean {
        if (option.activeCondition) {
            return option.activeCondition();
        } else {
            return true;
        }
    }

    getOptionName(option: ViewOption) {
        if (option.warned) {
            return option.warnMsg;
        }
        return option.name;
    }

    executeOption(option: ViewOption) {
        if (this.disableOptions || !this.checkOptionActiveCondition(option)) {
            return;
        }


        if (option.shouldWarn && !option.warned) {
            option.warned = true;
            return;
        }

        this.selectedOption = option;
        option.callback();
    }

}
