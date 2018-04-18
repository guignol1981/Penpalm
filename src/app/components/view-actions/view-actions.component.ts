import {Component, Input, OnInit} from '@angular/core';
import {ViewAction} from '../../models/actions/view-action';
import {EViewAction} from '../../models/actions/e-view-action.enum';

@Component({
    selector: 'app-view-actions',
    templateUrl: './view-actions.component.html',
    styleUrls: ['./view-actions.component.scss']
})
export class ViewActionsComponent implements OnInit {
    @Input() actions: ViewAction[];
    @Input() disableActions: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    getActionClass(action: ViewAction) {
        let cssClass = 'btn';

        if (this.disableActions) {
            cssClass += ' btn--disabled';
            return cssClass;
        }

        switch (action.type) {
            case EViewAction.Danger:
                return cssClass += ' btn--danger';
            case EViewAction.Primary:
                return cssClass += ' btn--primary';
            case EViewAction.Warning:
                return cssClass += ' btn--warning';
            case EViewAction.Secondary:
            default:
                return cssClass += ' btn--secondary';
        }
    }

    getActionName(action: ViewAction) {
        if (action.warned) {
            return action.warnMsg;
        }
        return action.name;
    }

    executeAction(action: ViewAction) {
        if (this.disableActions) {
            return;
        }

        if (action.shouldWarn && !action.warned) {
            action.warned = true;
            return;
        }
        action.callback();
    }

}
