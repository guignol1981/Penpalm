
export class User {

    constructor(public _id?: string,
                public name?: string,
                public email?: string,
                public photoUrl?: string,
                public language?: string,
                public country?: string,
                public description?: string,
                public showPicture?: boolean,
                public showName?: boolean,
                public enableEmailNotifications?: boolean) {
    }

}
