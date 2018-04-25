import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  cancel() {
    this.closeEvent.emit(true);
  }

  signIn() {

  }

}
