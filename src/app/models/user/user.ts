export class User {

    constructor(public _id?: string,
                public email?: string,
                public photoUrl?: string,
                public penPal?: User) {
    }

}
