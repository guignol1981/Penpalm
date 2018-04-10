import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PostcardService} from '../../services/postcard.service';
import {Postcard} from '../../models/postcard/postcard';
import {DomSanitizer} from '@angular/platform-browser';
import {createSrcToOutPathMapper} from '@angular/compiler-cli/src/transformers/program';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
    @Input() direction: string;
    postcards: Postcard[];
    activePostcard: Postcard;
    spotySrc;
    navIndex = 0;
    totalCount = 0;
    refreshing = false;
    shownSide = 'front';
    fetchConfig = {
        skip: 0,
        direction: ''
    };

    constructor(private postcardService: PostcardService,
                private domSanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.fetchConfig.direction = this.direction;
        this.fetchPostcards();
    }

    fetchPostcards() {
        this.refreshing = true;
        this.postcardService.fetch(this.fetchConfig).then(response => {
            response.postcards.forEach((item) => {
                item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
            });
            this.postcards = response.postcards;
            this.totalCount = response.count;
            this.refreshing = false;
            this.navTo(0);
        });
    }

    getImageClass() {
        let cssClass = 'postcard__image';
        switch (this.activePostcard.imageFitType) {
            case 'cover':
                return cssClass += ' postcard__image--cover';
            case 'fill':
                return cssClass += ' postcard__image--fill';
            case 'none':
                return cssClass += ' postcard__image--none';
            case 'contain':
            default:
                return cssClass += ' postcard__image--cover';
        }
    }

    navTo(index) {
        this.navIndex = index;
        this.activePostcard = this.postcards[this.navIndex];
        this.markActivePostcardAsSeen();
    }

    markActivePostcardAsSeen() {
        if (!this.activePostcard) {
            return;
        }

        this.postcardService.markSeen(this.activePostcard).then(() => {
            this.spotySrc = this.getSongSource();
            this.setTemplate();
        });
    }

    setTemplate() {
        let template = this.activePostcard.template;
        let bodyElement = document.getElementById('postcardbody');

        if (!template) {
            bodyElement.style.background = '';
            return;
        }

        bodyElement.style.background = 'url(../../../assets/' + template + '-template.png)';
        bodyElement.style.backgroundRepeat = 'no-repeat';
        bodyElement.style.backgroundSize = 'cover';
        bodyElement.style.backgroundPosition = 'center';
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
        this.fetchConfig.skip =
            this.totalCount === this.totalCount - (this.totalCount % 5) ? this.totalCount - 5 : this.totalCount - (this.totalCount % 5);

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

    getSongSource() {
        if (!this.activePostcard.spotifyLink) {
            return null;
        }

        return this.domSanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed?uri=' + this.activePostcard.spotifyLink + '&view=coverart'
        );
    }

}
