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
    @Output() songRequested: EventEmitter<string> = new EventEmitter<string>();

    postcards: Postcard[];
    navIndex = 0;
    count = 0;
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
            this.count = response.count;
            this.refreshing = false;
            this.navTo(0);
        });
    }

    getImageClass() {
        let cssClass = 'postcard__image';
        switch (this.postcards[this.navIndex].imageFitType) {
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
        this.postcardService.markSeen(this.postcards[index]).then(() => {
            this.setTemplate();
        });
    }

    setTemplate() {
        let template = this.postcards[this.navIndex].template;

        if (template === 'none') {
            return;
        }

        let bodyElement = document.getElementById('postcardbody');
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

    getSongSource() {
        let src = this.domSanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed?uri=' + this.postcards[this.navIndex].spotifyLink + '&view=coverart'
        );

        return src;
    }

}
