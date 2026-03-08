import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList implements OnInit, OnDestroy{

  documents: Document[] = []
  private subscription: Subscription;
  
  constructor(private documentService: DocumentService){}

  ngOnInit(){
    
    this.subscription = this.documentService.documentListChangedEvent
      .subscribe(
        (documentsList: Document[]) => {
          this.documents = documentsList;
        }
      )
      this.documentService.getDocuments();
  } 

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
