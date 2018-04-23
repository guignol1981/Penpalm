export class ViewOption {
    public warned = false;

    constructor(
        public name: string,
        public callback: any,
        public shouldWarn: boolean = false,
        public staySelected: boolean = false,
        public condition: () => boolean = null,
        public warnMsg?: string,
        public icon?: string,
        public activeCondition?: () => boolean
    ) {}
}
