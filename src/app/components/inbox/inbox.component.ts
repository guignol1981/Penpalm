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
    count = 0;

    fetchConfig = {
        skip: 0
    };

    constructor(private postcardService: PostcardService) {
    }

    ngOnInit() {
        this.postcardService.getInbox(this.fetchConfig).then(response => {
            this.postcards = response.postcards;
            this.count = response.count;
            console.log(response);
        });
    }

    flip() {

    }

}
