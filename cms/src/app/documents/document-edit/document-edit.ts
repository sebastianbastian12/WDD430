import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit{

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: string;

  constructor (
            private documentService: DocumentService,
            private router: Router,
            private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id){
        this.editMode = false;
        return;
      }

      this.originalDocument = this.documentService.getDocument(this.id);

      if (!this.originalDocument){
        return;
      }

      this.editMode = true;

      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    })
  }

  
  onSubmit(form: NgForm){
    const value = form.value;

    const newDocument = new Document (
      '',
      value.name,
      value.description,
      value.url,
      null
    );

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }

  onCancel(){
    this.router.navigate(['/documents']);
  }

  

}
