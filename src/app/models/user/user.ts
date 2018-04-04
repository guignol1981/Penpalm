import {News} from "../news/news";
export class User {

    constructor(public _id?: string,
                public name?: string,
                public email?: string,
                public photoUrl?: string,
                public penPal?: User,
                public news?: News) {
    }

}
