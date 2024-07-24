import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { DetailmapComponent } from './detailmap/detailmap.component';

const routes: Routes = [
  { path:'map', component: MapComponent},
  { path:'detail', component: DetailmapComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
