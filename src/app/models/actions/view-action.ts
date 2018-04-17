import {EViewAction} from './e-view-action.enum';

export class ViewAction {
    public warned = false;

    constructor(
        public name: string,
        public callback: any,
        public type: EViewAction = EViewAction.Secondary,
        public shouldWarn: boolean = false,
        public warnMsg?: string
    ) {}
}
