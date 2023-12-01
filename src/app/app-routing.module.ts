import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecordingsComponent } from "./recordings/recordings.component";
import {LiveCameraComponent} from "./live-camera/live-camera.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: DashboardComponent },
  {path: 'recordings', component: RecordingsComponent },
  {path: 'live-camera', component: LiveCameraComponent },
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
