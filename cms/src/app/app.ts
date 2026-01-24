import { Component, signal } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  selectedFeature = 'Documents';
  swithView(selectedFeature:string){
      this.selectedFeature = selectedFeature;
  }
}
