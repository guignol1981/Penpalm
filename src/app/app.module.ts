import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {routing} from './routing';
import { HomeComponent } from './components/home/home.component';
import {FacebookModule} from 'ngx-facebook';
import {UserService} from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
      HttpModule,
      ReactiveFormsModule,
      routing,
      FacebookModule.forRoot()
  ],
  providers: [
      UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
