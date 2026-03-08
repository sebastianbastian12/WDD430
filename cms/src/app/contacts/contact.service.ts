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

    getContacts() {
       this.http.get<Contact[]>('https://cms-database-32de3-default-rtdb.firebaseio.com/contacts.json')
        .subscribe(
            (contacts: Contact[]) => {
                this.contacts = contacts ? contacts : [];
                this.maxContactId =  this.getMaxId();

                this.contacts.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name < b.name) return 1;
                    return 0;
                });

                this.contactListChangedEvent.next(this.contacts.slice());
            },
            (error: any) => {
                console.error('Error fetching contacts:', error);
            }
        );

/*        return this.contacts.slice(); */
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

    getContact(id: string): Contact {
        for(const contact of this.contacts){
            if(contact.id === id){
                return contact
            }
        }
        return null
    }

    addContact(newContact: Contact) {
        if (!newContact){
            return;
        }

        this.maxContactId++;
        newContact.id = this.maxContactId.toString();
        this.contacts.push(newContact);

        this.storeContacts();

    }

    updateContact(originalContact: Contact, newContact: Contact){
        if (!originalContact || !newContact) {
            return;
        }

        const pos = this.contacts.indexOf(originalContact);

        if (pos < 0 ) {
            return;
        }

        newContact.id = originalContact.id;

        this.contacts[pos] = newContact;

        this.storeContacts();

    }



    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0) {
            return;
        }

        this.contacts.splice(pos, 1);
        this.storeContacts();
    }
}