import { EventEmitter, Injectable } from "@angular/core";
import { Document } from "./document.model";
import { BehaviorSubject, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantPool } from "@angular/compiler";

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
        this.http.get<{message: String, documents: Document[]}>('http://localhost:3000/documents')
            .subscribe(
                (responseData) => {
                    this.documents = responseData.documents;
                    this.sortAndSend();
                },
                (error: any) => {
                    console.log(error);
                }
            );
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

   sortAndSend(){
    this.documents.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
   }

   addDocument(document: Document){
        if (!document) {
            return;
        }
    
        document.id = ''

        const headers = new HttpHeaders ({'Content-Type': 'application/json'});

        this.http.post<{ message: String, document: Document}> (
            'http://localhost:3000/documents',
            document,
            { headers: headers}
        )
        .subscribe(
            (responseData) => {
                this.documents.push(responseData.document);
                this.sortAndSend();
            }
        );
   }

   updateDocument(originalDocument: Document, newDocument: Document){
    if (!originalDocument || !newDocument) {
        return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0 ) {
        return;
    }

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders ({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
        newDocument, { headers: headers})
        .subscribe(
            (response: any) => {
                this.documents[pos] = newDocument;
                this.sortAndSend();
            }
        );
   }

    deleteDocument(document: Document) {
        if (!document) {
            return;
        }

        const pos = this.documents.findIndex(d => d.id === document.id);

        if (pos < 0) {
            return;
        }

        this.http.delete('http://localhost:3000/documents/' + document.id)
            .subscribe(
                (response: any) => {
                    this.documents.slice(pos, 1);
                    this.sortAndSend();
                }
            );
    }
}