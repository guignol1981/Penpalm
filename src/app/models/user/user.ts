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
                public enableEmailNotifications?: boolean,
                public pendingRequests?: string[],
                public pals?: string[]) {
    }

    hasRequestFrom(userId: string): boolean {
        let isRequestSent = false;

        this.pendingRequests.forEach((item) => {
            if (item === userId) {
                isRequestSent = true;
                return false;
            }
        });

        return isRequestSent;
    }

    isPal(userId: string) {
        let isPal = false;

        this.pals.forEach((item) => {
            if (item === userId) {
                isPal = true;
                return false;
            }
        });

        return isPal;
    }

}
