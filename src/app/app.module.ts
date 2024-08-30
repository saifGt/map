import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppRoutingModule } from './app-routing.module'; // Assurez-vous que le module de routage est importé
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DetailmapComponent } from './detailmap/detailmap.component';
import { FormsdependencyComponent } from './formsdependency/formsdependency.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationComponent } from './location/location.component';
import { FormsModule } from '@angular/forms';
import { UserLogComponent } from './user-log/user-log.component';
import { NavComponent } from './nav/nav.component';
import { AdminMapComponent } from './admin-map/admin-map.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailmapComponent,
    FormsdependencyComponent,
    LocationComponent,
    UserLogComponent,
    NavComponent,
    AdminMapComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
