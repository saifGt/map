import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppRoutingModule } from './app-routing.module'; // Assurez-vous que le module de routage est importé

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DetailmapComponent } from './detailmap/detailmap.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailmapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
