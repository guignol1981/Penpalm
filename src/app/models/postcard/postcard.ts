export class Postcard {

    constructor(public _id?: string,
                public body?: string,
                public imageUrl?: string,
                public imageFitType?: string,
                public seen?: boolean,
                public creationDate?: Date) {}

}
