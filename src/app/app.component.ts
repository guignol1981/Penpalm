import { Component } from '@angular/core';
import {AuthenticationService} from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authenticationService: AuthenticationService) {}


  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

}
