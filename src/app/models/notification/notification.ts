import {ENotification} from './e-notification.enum';

export class Notification {

    constructor(
        public type: ENotification,
        public msg: string
    ) {}

}
