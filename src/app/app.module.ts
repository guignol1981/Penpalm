import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {routing} from './routing';
import { HomeComponent } from './components/home/home.component';
import {FacebookModule} from 'ngx-facebook';
import {UserService} from './services/user.service';
import { LoginComponent } from './components/login/login.component';
import {AuthenticationService} from "./services/authentication.service";
import {CanActivateViaAuthGuardService} from "./services/can-activate-via-auth-guard.service";
import { PostCardComponent } from './components/post-card/post-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PostCardComponent
  ],
  imports: [
    BrowserModule,
      HttpModule,
      ReactiveFormsModule,
      routing,
      FacebookModule.forRoot()
  ],
  providers: [
      UserService,
      AuthenticationService,
      CanActivateViaAuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
