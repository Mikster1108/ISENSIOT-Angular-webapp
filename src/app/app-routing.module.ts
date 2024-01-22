import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecordingsComponent } from "./recordings/recordings.component";
import {LiveCameraComponent} from "./live-camera/live-camera.component";
import {LoginComponent} from "./login/login.component";
import {ProfileComponent} from "./profile/profile.component";
import {AuthGuard} from "./helpers/auth.guard";
import {RegisterComponent} from "./register/register.component";
import {RecordingComponent} from "./recordings/recording/recording.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  {path: 'recordings', component: RecordingsComponent, canActivate: [AuthGuard] },
  {path: 'recording/:videoName', component: RecordingComponent, canActivate: [AuthGuard]},
  {path: 'live-camera', component: LiveCameraComponent, canActivate: [AuthGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
