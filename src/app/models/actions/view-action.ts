import {EViewAction} from './e-view-action.enum';

export class ViewAction {
    public warned = false;

    constructor(
        public name: string,
        public callback: (action: ViewAction) => any,
        public type: EViewAction = EViewAction.Secondary,
        public shouldWarn: boolean = false,
        public condition: () => boolean = null,
        public warnMsg?: string
    ) {}
}
