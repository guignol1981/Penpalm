import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user/user';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.scss']
})
export class MatcherComponent implements OnInit {
  @Input() user: User;
  selectedOption = '';

  constructor() { }

  ngOnInit() {
  }

  selectOption(option) {
    this.selectedOption = option;
  }

  applyFilters() {

  }

}
