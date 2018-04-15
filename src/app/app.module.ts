import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {routing} from './routing';
import {HomeComponent} from './components/home/home.component';
import {UserService} from './services/user.service';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationService} from './services/authentication.service';
import {CanActivateViaAuthGuardService} from './services/can-activate-via-auth-guard.service';
import {PostcardComponent} from './components/postcard/postcard.component';
import {LogoutComponent} from './components/logout/logout.component';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angular4-social-login';
import {FooterComponent} from './components/footer/footer.component';
import {InboxComponent} from './components/inbox/inbox.component';
import {ComposeComponent} from './components/compose/compose.component';
import {AccountComponent} from './components/account/account.component';
import {NewsComponent} from './components/news/news.component';
import {PostcardService} from './services/postcard.service';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NewsService} from './services/news.service';
import {YoutubePlayerModule} from 'ng2-youtube-player';
import {MatcherComponent} from './components/matcher/matcher.component';
import {UtilService} from './services/util.service';
import {ImageUploadModule} from 'angular2-image-upload';


let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('591045054488-nug10r1poru3a20birl1ddetkdkq53b6.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1055819054566173')
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        PostcardComponent,
        LogoutComponent,
        FooterComponent,
        InboxComponent,
        ComposeComponent,
        AccountComponent,
        NewsComponent,
        MatcherComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpModule,
        ReactiveFormsModule,
        routing,
        SocialLoginModule,
        SimpleNotificationsModule.forRoot(),
        YoutubePlayerModule,
        ImageUploadModule.forRoot()
    ],
    providers: [
        UtilService,
        UserService,
        PostcardService,
        NewsService,
        AuthenticationService,
        CanActivateViaAuthGuardService,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
