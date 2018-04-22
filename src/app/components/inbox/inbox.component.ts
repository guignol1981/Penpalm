import {Component, Input, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {PostcardService} from '../../services/postcard.service';
import {Postcard} from '../../models/postcard/postcard';
import {DomSanitizer} from '@angular/platform-browser';
import {BaseViewComponent} from '../base-view/base-view.component';
import {ViewAction} from '../../models/actions/view-action';
import {SingleInput} from '../../models/single-input/single-input';
import {ViewOptionGroup} from '../../models/options/view-option-group';
import {InboxViewData} from '../../models/view-data/inbox-view-data';
import {EPostcardMode, PostcardComponent} from '../postcard/postcard.component';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss', '../base-view/base-view.component.scss']
})
export class InboxComponent extends BaseViewComponent implements OnInit, AfterViewInit {
    @ViewChild(PostcardComponent) postcardComponent: PostcardComponent;
    @Input() direction: string;
    postcards: Postcard[];
    activePostcard: Postcard;
    ePostcardMode = EPostcardMode;
    transacting = false;
    spotySrc;
    navIndex = 0;
    totalCount = 0;
    refreshing = false;
    shownSide = 'front';
    fetchConfig = {
        skip: 0,
        direction: ''
    };

    inputs: SingleInput[];
    optionGroups: ViewOptionGroup[];
    actions: ViewAction[];

    constructor(private postcardService: PostcardService,
                private domSanitizer: DomSanitizer) {
        super();
    }

    ngOnInit() {
        this.fetchConfig.direction = this.direction;
        this.optionGroups = InboxViewData.getOptions(this);
        this.actions = InboxViewData.getActions(this);
        this.inputs = InboxViewData.getInputs(this);
    }

    ngAfterViewInit() {
        this.fetchPostcards();
    }

    fetchPostcards() {
        this.refreshing = true;
        this.postcardService.fetch(this.fetchConfig).then(response => {
            this.postcards = response.postcards;
            this.totalCount = response.count;
            this.refreshing = false;
            this.navTo(0);
        });
    }

    navTo(index) {
        this.navIndex = index;
        this.activePostcard = this.postcards[this.navIndex];
        if (this.activePostcard) {
            this.spotySrc = this.getSongSource();
            this.postcardComponent.setPostcard(this.activePostcard);
            this.markActivePostcardAsSeen();
        }
    }

    markActivePostcardAsSeen() {
        if (!this.activePostcard || this.activePostcard.seen) {
            return;
        }

        this.postcardService.markSeen(this.activePostcard).then(() => {

        });
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

    flipPostcard() {
        if (this.shownSide === 'front') {
            this.shownSide = 'back';
        } else {
            this.shownSide = 'front';
        }

        this.postcardComponent.flip();
    }

    getSongSource() {
        if (!this.activePostcard || !this.activePostcard.spotifyLink) {
            return null;
        }

        return this.domSanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed?uri=' + this.activePostcard.spotifyLink + '&view=coverart'
        );
    }

}
