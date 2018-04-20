import {ESingleInput} from "./e-single-input.enum";
export class SingleInput {
    public value = null;
    constructor(
        public label: string,
        public inputType: ESingleInput,
        public callback: any,
        public condition: () => boolean = null,
        public icon?: string,
        public lov?: string[]
    ) {}
}
