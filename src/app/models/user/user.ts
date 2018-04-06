import {News} from "../news/news";
import {Preference} from './preference';
export class User {

    constructor(public _id?: string,
                public name?: string,
                public email?: string,
                public photoUrl?: string,
                public penPal?: User,
                public preferences?: Preference) {
    }

}
