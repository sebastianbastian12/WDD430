import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

  @Injectable({
    providedIn: 'root'
})
  export class ContactService {
    contactListChangedEvent = new BehaviorSubject<Contact[]>([]);
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();

     contacts: Contact [] =[];
     maxContactId: number;
     
     constructor(private http: HttpClient) {}

    storeContacts() {
        const contactsString = JSON.stringify(this.contacts);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put (
            'https://cms-database-32de3-default-rtdb.firebaseio.com/contacts.json',
            contactsString,
            {headers: headers}
        )

        .subscribe(() => {
            this.contactListChangedEvent.next(this.contacts.slice());
        });
    }

    getContacts(){
        this.http.get<{message: String, contacts: Contact[]}>('http://localhost:3000/contacts')
            .subscribe(
                (responseData) => {
                    this.contacts = responseData.contacts;
                    this.sortAndSend();
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }

    getMaxId(): number {
        let maxId = 0;

        for (const contact of this.contacts) {
            const currentId = parseInt(contact.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
            return maxId;
    }

    sortAndSend(){
    this.contacts.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
   }

    getContact(id: string): Contact {
        for(const contact of this.contacts){
            if(contact.id === id){
                return contact
            }
        }
        return null
    }

    addContact(contact: Contact){
        if (!contact) {
            return;
        }
    
        contact.id = ''

        const headers = new HttpHeaders ({'Content-Type': 'application/json'});

        this.http.post<{ message: String, contact: Contact}> (
            'http://localhost:3000/contacts',
            contact,
            { headers: headers}
        )
        .subscribe(
            (responseData) => {
                this.contacts.push(responseData.contact);
                this.sortAndSend();
            }
        );
    }

    updateContact(originalContact: Contact, newContact: Contact){
    if (!originalContact || !newContact) {
        return;
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);

    if (pos < 0 ) {
        return;
    }

    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders ({'Content-Type': 'application/json'});

    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
        newContact, { headers: headers})
        .subscribe(
            (response) => {
                this.contacts[pos] = newContact;
                this.sortAndSend();
            }
        );
    }
    
    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }

        const pos = this.contacts.findIndex(c => c.id === contact.id);

        if (pos < 0) {
            return;
        }

        this.http.delete('http://localhost:3000/contacts/' + contact.id)
            .subscribe(
                (response) => {
                    this.contacts.slice(pos, 1);
                    this.sortAndSend();
                }
            );
    }
}