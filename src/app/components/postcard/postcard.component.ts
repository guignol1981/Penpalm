import {Component, Input, OnInit} from '@angular/core';
import {Postcard} from '../../models/postcard/postcard';

@Component({
  selector: 'app-post-card',
  templateUrl: './postcard.component.html',
  styleUrls: ['./postcard.component.scss']
})
export class PostcardComponent implements OnInit {
  @Input() postcard: Postcard;

  constructor() { }

  ngOnInit() {
      this.postcard = new Postcard('', '');
  }

}
