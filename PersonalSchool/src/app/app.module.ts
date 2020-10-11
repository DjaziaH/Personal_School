import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeComponent } from './welcome/welcome.component';


import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { NewModuleComponent } from './new-module/new-module.component';
import { EditModuleComponent } from './edit-module/edit-module.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    WelcomeComponent,
    NewModuleComponent,
    EditModuleComponent,
    NewCourseComponent,
    EditCourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
