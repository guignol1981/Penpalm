import {ESingleInput} from './e-single-input.enum';

export interface LovItem {
    label: string;
    id: string;
}

export class SingleInput {
    public value: any = null;
    public lovValue: LovItem = null;
    public boolValue = false;

    constructor(public label: string,
                public inputType: ESingleInput,
                public callback: any,
                public condition: () => boolean = null,
                public icon?: string,
                public lov?: LovItem[],
                public placeHolder?: string,
                public helperMsg?: string) {
    }
}
