import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user/user";
import {News} from "../../models/news/news";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @Input() newsList: News[];

  constructor() { }

  ngOnInit() {
  }

}
