import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { HomeComponent } from "./home/home.component";
import { NewModuleComponent } from './new-module/new-module.component';

const routes: Routes = [
  {path: "welcome",component :WelcomeComponent},
  {path:"login",component :LoginComponent},
  {path:"signup",component:SignupComponent},
  {path: "home",component:HomeComponent},
  {path: "modules/:moduleId",component:HomeComponent},
  {path: "modules/:moduleId/courses/:courseId",component:HomeComponent},
  {path: "modules/:moduleId/courses/:courseId/contents/:contentId",component:HomeComponent},
  {path: "modules/:moduleId/courses/:courseId/contents",component:HomeComponent},
  {path: '' , redirectTo: '/welcome' , pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
