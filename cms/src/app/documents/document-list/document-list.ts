import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document ('1', 'Employees', 'list of the employees of the company', 'wwww.excel-employees.com', null),
    new Document ('2', 'Salaries', 'list of the employees salaries of the company', 'wwww.excel-salaries.com', null),
    new Document ('3', 'Departments', 'list of the departments of the company', 'wwww.excel-departments.com', null),
    new Document ('4', 'Clients', 'list of the clients of the company', 'wwww.excel-clients.com', null),
    new Document ('5', 'Facilities', 'list of the facilities of the company', 'wwww.excel-facilities.com', null)
  ]

  onSelectedDocument(document: Document){
      this.selectedDocumentEvent.emit(document);
    }
  
}
