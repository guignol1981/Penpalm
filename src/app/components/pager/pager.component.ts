import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface PagerEvent {
    navIndex: number;
}

@Component({
    selector: 'app-pager',
    templateUrl: './pager.component.html',
    styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
    @Input() totalCount = 0;
    @Input() disabled = false;
    @Input() skipStep: number;
    @Output() pagerEventEmitter: EventEmitter<PagerEvent> = new EventEmitter<PagerEvent>();
    skipValue = 0;
    navIndex = 0;
    displayedPageCount = 5;

    constructor() {
    }

    ngOnInit() {
    }

    get pages(): any[] {
        let totalPagesCount = Math.ceil(this.totalCount / this.skipStep);
        let pagesCount = 0;

        if (this.skipValue > totalPagesCount - this.displayedPageCount) {
            if (this.skipValue > 0) {
                pagesCount = totalPagesCount % this.skipValue;
            } else {
                pagesCount = totalPagesCount;
            }
        } else {
            pagesCount = totalPagesCount > this.displayedPageCount ? this.displayedPageCount : totalPagesCount;
        }

        return new Array(pagesCount);
    }

    get canSkipForward() {
        if (this.disabled) {
            return false;
        }

        let totalPagesCount = Math.ceil(this.totalCount / this.skipStep);
        return totalPagesCount > this.skipValue + this.displayedPageCount;
    }

    get canSkipBackward() {
        if (this.disabled) {
            return false;
        }

        return this.skipValue > 0;
    }

    skipFirst() {
        this.skipValue = 0;
        this.navTo(0);
    }

    skipLast() {
        this.skipValue =
            this.totalCount === this.totalCount - (this.totalCount % this.skipStep) ?
                this.totalCount - this.skipStep :
                this.totalCount - (this.totalCount % this.skipStep);
        this.navTo(0);
    }

    skipBackward() {
        this.skipValue -= this.displayedPageCount;
        if (this.skipValue < 0) {
            this.skipValue = 0;
        }
        this.navTo(0);
    }

    skipForward() {
        this.skipValue += this.displayedPageCount;
        this.navTo(0);
    }

    navTo(index: number) {
        this.navIndex = index;
        console.log('nav index ' + this.navIndex);
        console.log('skip value ' + this.skipValue);
        this.pagerEventEmitter.emit({navIndex: (this.navIndex) + this.skipValue});
    }
}
