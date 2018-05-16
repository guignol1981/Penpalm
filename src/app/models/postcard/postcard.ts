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
                public spotifyLink?: any,
                public allowShare?: boolean,
                public template?: string,
                public recipient?: string,
                public author?: User,
                public seen: boolean = false,
                public creationDate: Date = new Date()) {
    }

}


