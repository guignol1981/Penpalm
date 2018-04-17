export class ViewOption {
    public warned = false;

    constructor(
        public name: string,
        public callback: any,
        public shouldWarn: boolean = false,
        public warnMsg?: string
    ) {}
}
