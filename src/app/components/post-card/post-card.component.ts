import {Component, Input, OnInit} from '@angular/core';
import {Postcard} from '../../models/post-card/postcard';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  @Input() postcard: Postcard;

  constructor() { }

  ngOnInit() {
      this.postcard = new Postcard('', '');
  }

}
