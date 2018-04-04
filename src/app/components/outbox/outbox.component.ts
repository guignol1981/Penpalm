import { Component, OnInit } from '@angular/core';
import {Postcard} from "../../models/postcard/postcard";
import {PostcardService} from "../../services/postcard.service";

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {
  postcards: Postcard[];
  navIndex = 0;
  constructor(private postcardService: PostcardService) {
  }

  ngOnInit() {
    this.postcardService.getSent().then((postcards: Postcard[]) => {
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
