import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecordingsComponent } from "./recordings/recordings.component";
import {LiveCameraComponent} from "./live-camera/live-camera.component";
import {LoginComponent} from "./login/login.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: DashboardComponent },
  {path: 'recordings', component: RecordingsComponent },
  {path: 'live-camera', component: LiveCameraComponent },
  {path: 'login', component: LoginComponent },
  {path: 'profile', component: ProfileComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
