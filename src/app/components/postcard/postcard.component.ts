import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EBackSideOption, Postcard} from '../../models/postcard/postcard';

export enum EPostcardMode {
    Write,
    Read
}

@Component({
    selector: 'app-post-card',
    templateUrl: './postcard.component.html',
    styleUrls: ['./postcard.component.scss']
})
export class PostcardComponent implements OnInit {
    @Input() postcard: Postcard;
    @Input() mode: EPostcardMode;
    @Output() composeModeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    public shownSide = 'front';
    eBackSideOption = EBackSideOption;

    constructor() {
    }

    ngOnInit() {

    }

    @Input()
    flip() {
        let postcard = document.getElementById('postcard');

        if (this.shownSide === 'front') {
            this.shownSide = 'back';
            postcard.style.transform = 'rotateY(180deg)';
        } else {
            this.shownSide = 'front';
            postcard.style.transform = 'rotateY(0deg)';
        }
    }

    @Input()
    setTemplate(templateName, bodyElement = null, backElement = null) {
        bodyElement = bodyElement || document.getElementById('body');
        backElement = backElement || document.getElementById('back');

        if (templateName) {
            bodyElement.style.background = 'url(../../../assets/' + templateName + '-template_front.png)';
            bodyElement.style.backgroundRepeat = 'no-repeat';
            bodyElement.style.backgroundSize = 'cover';
            bodyElement.style.backgroundPosition = 'center';

            backElement.style.background = 'url(../../../assets/' + templateName + '-template_back.png)';
            backElement.style.backgroundRepeat = 'no-repeat';
            backElement.style.backgroundSize = 'cover';
            backElement.style.backgroundPosition = 'center';
        } else {
            bodyElement.style.background = '';
            backElement.style.background = '';
        }
    }


    get imageUrl() {
        if (this.postcard.backSideOptionType === EBackSideOption.LinkImage ||
            this.postcard.backSideOptionType === EBackSideOption.UploadImage) {
            return this.postcard.backSideValue;
        }
        return null;
    }

    get dateNow() {
        return Date.now();
    }

    get geoData() {
        return {
            lat: this.postcard.backSideValue.lat,
            lng: this.postcard.backSideValue.lng
        };
    }

    compose() {
        this.composeModeEmitter.emit(true);
    }

}
