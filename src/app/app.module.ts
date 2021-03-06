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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NewsService} from './services/news.service';
import {YoutubePlayerModule} from 'ng2-youtube-player';
import {MatcherComponent} from './components/matcher/matcher.component';
import {UtilService} from './services/util.service';
import {AgmCoreModule} from '@agm/core';
import {ImageUploadModule} from 'angular2-image-upload';
import {GoogleMapService} from './services/google-map.service';
import {BaseViewComponent} from './components/base-view/base-view.component';
import {ViewOptionsComponent} from './components/view-options/view-options.component';
import {ViewActionsComponent} from './components/view-actions/view-actions.component';
import {NotificationComponent} from './components/notification/notification.component';
import {LoaderComponent} from './components/loader/loader.component';
import {ViewSingleInputComponent} from './components/view-single-input/view-single-input.component';
import {ImageService} from './services/image.service';
import {ImageCropperModule} from 'ngx-img-cropper';
import { UploaderModalComponent } from './components/uploader-modal/uploader-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { environment } from '../environments/environment';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PagerComponent } from './components/pager/pager.component';


let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('591045054488-nug10r1poru3a20birl1ddetkdkq53b6.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(environment.facebookAppId)
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
        MatcherComponent,
        BaseViewComponent,
        ViewOptionsComponent,
        ViewActionsComponent,
        NotificationComponent,
        LoaderComponent,
        ViewSingleInputComponent,
        UploaderModalComponent,
        RegisterModalComponent,
        LoginModalComponent,
        ConfirmEmailComponent,
        AlertModalComponent,
        ResetPasswordComponent,
        ProfileCardComponent,
        ProfileComponent,
        PagerComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpModule,
        ReactiveFormsModule,
        routing,
        SocialLoginModule,
        YoutubePlayerModule,
        ImageCropperModule,
        ImageUploadModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAy4grLuONSG-gN4UuAAi-5lWZPXWO5nbM'
        })
    ],
    providers: [
        ImageService,
        GoogleMapService,
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
