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
import { LogoutComponent } from './components/logout/logout.component';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angular4-social-login';
import { FooterComponent } from './components/footer/footer.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { OutboxComponent } from './components/outbox/outbox.component';
import { ComposeComponent } from './components/compose/compose.component';
import { AccountComponent } from './components/account/account.component';
import { NewsComponent } from './components/news/news.component';

let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('591045054488-nug10r1poru3a20birl1ddetkdkq53b6.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1788186814836142')
    }
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PostCardComponent,
    LogoutComponent,
    FooterComponent,
    InboxComponent,
    OutboxComponent,
    ComposeComponent,
    AccountComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
      HttpModule,
      ReactiveFormsModule,
      routing,
      SocialLoginModule.initialize(config)
  ],
  providers: [
      UserService,
      AuthenticationService,
      CanActivateViaAuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
