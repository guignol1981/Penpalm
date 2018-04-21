import {User} from '../user/user';

export enum EBackSideOption {
    None,
    Youtube,
    Location,
    LinkImage,
    UploadImage
}

export class Postcard {

    constructor(public _id?: string,
                public body?: string,
                public backSideOptionType: EBackSideOption = EBackSideOption.None,
                public backSideValue?: any,
                public spotifyLink?: string,
                public allowShare?: boolean,
                public template?: string,
                public recipient?: string,
                public author?: User,
                public seen?: boolean,
                public creationDate?: Date) {
    }

}


