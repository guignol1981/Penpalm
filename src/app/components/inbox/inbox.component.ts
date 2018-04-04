import {Component, OnInit} from '@angular/core';
import {PostcardService} from "../../services/postcard.service";
import {Postcard} from "../../models/postcard/postcard";

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
    postcards: Postcard[];
    navIndex = 0;
    constructor(private postcardService: PostcardService) {
    }

    ngOnInit() {
        this.postcardService.getInbox().then((postcards: Postcard[]) => {
            this.postcards = postcards;
        });
    }

    navTo(direction) {
        if (
            (direction === -1 && this.canNavigateForward())
            ||
            (direction === 1 && this.canNavigateBackward())
        ) {
            this.navIndex += direction;
        }
    }

    canNavigateForward() {
        return this.navIndex > 0;
    }

    canNavigateBackward() {
        return this.navIndex + 1 < this.postcards.length;
    }
}
