import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user/user";
import {News} from "../../models/news/news";
import {NewsService} from "../../services/news.service";

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
    news: News;

    constructor(private newsService: NewsService) {
    }

    ngOnInit() {
        this.newsService.fetch().then((news: News) => {
            this.news = news;
        });
    }

}
