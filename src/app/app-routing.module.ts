import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { DetailmapComponent } from './detailmap/detailmap.component';
import { FormsdependencyComponent } from './formsdependency/formsdependency.component';
import { LocationComponent } from './location/location.component';
import { UserLogComponent } from './user-log/user-log.component';

const routes: Routes = [
  {path:'login',  component: UserLogComponent},

  { path: 'map', component: MapComponent },
  { path: 'detailmap', component: DetailmapComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path : 'form',component:FormsdependencyComponent},
  {path : 'location',component:LocationComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
