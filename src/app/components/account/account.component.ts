import {Component, Input, OnInit} from '@angular/core';
import {Preference} from '../../models/user/preference';
import {UserService} from '../../services/user.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Input() preference: Preference;
  form: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit() {
      this.form = new FormGroup({
          displayImage: new FormControl(this.preference.displayImage),
          displayRealName: new FormControl(this.preference.displayRealName),
          emailNotifications: new FormControl(this.preference.emailNotifications),
          nickName: new FormControl(this.preference.nickname),
      });
  }

  submit() {

  }

  deleteAccount() {

  }


}
