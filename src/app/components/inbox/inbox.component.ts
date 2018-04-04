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
    constructor(private postcardService: PostcardService) {
    }

    ngOnInit() {
        this.postcardService.getInbox().then((postcards: Postcard[]) => {
            this.postcards = postcards;
        });
    }


}
