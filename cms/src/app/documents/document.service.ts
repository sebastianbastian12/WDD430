import { EventEmitter, Injectable } from "@angular/core";
import { Document } from "./document.model";
import { BehaviorSubject, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class DocumentService {
   documentListChangedEvent = new BehaviorSubject<Document[]>([]);
   documentSelectedEvent = new EventEmitter<Document>();
   
   private documents: Document [] = [];
   maxDocumentId: number;

   constructor(private http: HttpClient){}

    storeDocuments() {
        const documentsString = JSON.stringify(this.documents);

        const headers = new HttpHeaders ({
            'Content-Type': 'application/json'
        });

        this.http.put(
            'https://cms-database-32de3-default-rtdb.firebaseio.com/documents.json',
            documentsString,
            {headers: headers}
        )
        .subscribe(() => {
            this.documentListChangedEvent.next(this.documents.slice());
        })
    }

    getDocuments(){

        this.http.get<Document[]>('https://cms-database-32de3-default-rtdb.firebaseio.com/documents.json')
            .subscribe(
                (documents: Document[]) => {
                    this.documents = documents ? documents : [];
                    this.maxDocumentId = this.getMaxId();

                    this.documents.sort((a, b) => {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    })

                    this.documentListChangedEvent.next(this.documents.slice());
                },
                (error: any) => {
                    console.log('An error occurred while fetching documents:', error);
                }
            )
        }
   
    getDocument(id:string):Document {
        for (const document of this.documents){
            if(document.id === id){
                return document
            }
        }

        return null
    }
    

   getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
        const currentId = parseInt(document.id);
        if (currentId > maxId) {
            maxId = currentId;
        }
    }
        return maxId;
   }

   addDocument(newDocument: Document){
    if (!newDocument){
        return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);

    this.storeDocuments();
   }

   updateDocument(originalDocument: Document, newDocument: Document){
    if (!originalDocument || !newDocument) {
        return;
    }

    const pos = this.documents.indexOf(originalDocument);

    if (pos < 0 ) {
        return;
    }

    newDocument.id = originalDocument.id;

    this.documents[pos] = newDocument;

    this.storeDocuments();

   }

    deleteDocument(document: Document) {
        if (!document) {
            return;
        }

        const pos = this.documents.indexOf(document);

        if (pos < 0) {
            return;
        }

        this.documents.splice(pos, 1);

        this.storeDocuments();
    }
}