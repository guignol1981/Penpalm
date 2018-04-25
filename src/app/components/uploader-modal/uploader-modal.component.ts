import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImageCropperComponent, CropperSettings} from 'ngx-img-cropper';
import {ImageService} from '../../services/image.service';

export interface ImageUploadEvent {
    callback: (file: File, preview: any) => any;
}

@Component({
    selector: 'app-uploader-modal',
    templateUrl: './uploader-modal.component.html',
    styleUrls: ['./uploader-modal.component.scss']
})
export class UploaderModalComponent implements OnInit {
    @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    image = null;
    cropperSettings: CropperSettings;

    event: ImageUploadEvent;

    constructor() {
    }

    ngOnInit() {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.noFileInput = true;
    }

    @Input()
    setEvent(event: ImageUploadEvent) {
        this.event = event;
    }

    fileChangeListener(event) {
        let image: any = new Image();
        let file: File = event.target.files[0];
        let myReader: FileReader = new FileReader();
        let me = this;

        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            me.cropper.setImage(image);
            me.image = image;
        };

        myReader.readAsDataURL(file);
    }

    onCancel() {
        this.closeEvent.emit(true);
    }

    onDone() {
        if (!this.image) {
            return;
        }

        this.event.callback(ImageService.dataURLtoFile(this.image.image, 'image'), this.image.image);
        this.closeEvent.emit(true);
    }

}
