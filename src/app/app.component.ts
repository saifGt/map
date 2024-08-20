import { Component, OnInit } from '@angular/core';
import { MapBDService } from './map-bd.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers :[MapBDService]
})
export class AppComponent implements OnInit {
  title = 'my-angular-project';
  


  ngOnInit(): void {
   
  }
}
