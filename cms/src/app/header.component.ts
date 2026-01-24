import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'cms-header',
    templateUrl: './header.component.html',
    standalone: false
})

export class HeaderComponent {

@Output() selectedFeatureEvent = new EventEmitter<string>();

onSelected(SelectedEvent: string){
    this.selectedFeatureEvent.emit(SelectedEvent);
}
}