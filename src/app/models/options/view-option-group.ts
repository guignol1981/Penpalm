import {ViewOption} from './view-option';


export class ViewOptionGroup {
    constructor(public name: string,
                public options: ViewOption[],
                public condition: () => boolean = null,
                public icon?: string
    ) {}

}
