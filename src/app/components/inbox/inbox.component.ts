import {Component, Input, OnInit} from '@angular/core';
import {PostcardService} from "../../services/postcard.service";
import {Postcard} from "../../models/postcard/postcard";

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
    @Input() direction: string;
    postcards: Postcard[];
    navIndex = 0;
    count = 0;
    refreshing = false;
    shownSide = 'front';
    fetchConfig = {
        skip: 0,
        direction: ''
    };

    constructor(private postcardService: PostcardService) {
    }

    ngOnInit() {
        this.fetchConfig.direction = this.direction;
        this.fetchPostcards();
    }

    fetchPostcards() {
        this.refreshing = true;
        this.postcardService.fetch(this.fetchConfig).then(response => {
            this.navIndex = 0;
            this.postcards = response.postcards;
            this.count = response.count;
            this.refreshing = false;
        });
    }

    navTo(index) {
        this.navIndex = index;
    }

    skipForward() {
        if (this.refreshing) {
            return;
        }
        this.fetchConfig.skip += 5;
        this.fetchPostcards();
    }

    skipBackward() {
        if (this.refreshing) {
            return;
        }
        this.fetchConfig.skip -= 5;
        this.fetchPostcards();
    }

    skipLast() {
        if (this.refreshing) {
            return;
        }
        this.fetchConfig.skip = this.count === this.count - (this.count % 5) ? this.count - 5 : this.count - (this.count % 5);
        this.fetchPostcards();
    }

    skipFirst() {
        if (this.refreshing) {
            return;
        }

        this.fetchConfig.skip = 0;
        this.fetchPostcards();
    }

    flip(postcard) {
        if (this.shownSide === 'front') {
            this.shownSide = 'back';
            postcard.style.transform = 'rotateY(180deg)';
        } else {
            this.shownSide = 'front';
            postcard.style.transform = 'rotateY(0deg)';
        }
    }

}
