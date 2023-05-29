import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './logisticaIntegral/home/home.component';
import { HomeModule } from './logisticaIntegral/home/home.module';
import { NavbarComponent } from './logisticaIntegral/home/components/navbar/navbar.component';
import { SidebarComponent } from './logisticaIntegral/home/components/sidebar/sidebar.component';
import { FooterComponent } from './logisticaIntegral/home/components/footer/footer.component';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    DataTablesModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }