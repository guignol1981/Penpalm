import {User} from '../user/user';

export class Postcard {

    constructor(public _id?: string,
                public body?: string,
                public imageUrl?: string,
                public imageFitType?: string,
                public spotifyLink?: string,
                public youtubeId?: string,
                public allowShare?: boolean,
                public template?: string,
                public recipient?: string,
                public author?: User,
                public seen?: boolean,
                public creationDate?: Date) {}

}


