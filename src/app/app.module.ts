import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecordingsComponent } from './recordings/recordings.component';
import { LiveCameraComponent } from './live-camera/live-camera.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ContentComponent } from './content/content.component';
import { VideoComponent } from "./recordings/video/video-component";
import { RouterModule } from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {authInterceptorProviders} from "./helpers/auth.interceptor";
import { ErrorDisplayComponent } from './error-display/error-display.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    RecordingsComponent,
    LiveCameraComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ContentComponent,
    VideoComponent,
    ErrorDisplayComponent,
  ],
    imports: [
        BrowserModule,
        RouterModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        CommonModule
    ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
