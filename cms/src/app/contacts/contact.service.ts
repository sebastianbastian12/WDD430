import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
})
  export class ContactService {
    contactListChangedEvent = new Subject<Contact[]>();
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();

     contacts: Contact [] =[];
     maxContactId: number;
     
     constructor() {
        this.contacts = MOCKCONTACTS;
        this.maxContactId = this.getMaxId();
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

    getContacts() {
       return this.contacts.slice();
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
    if (newContact === undefined || newContact === null){
        return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);

    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
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

    const contactListClone = this.contacts.slice();

    this.contactListChangedEvent.next(contactListClone);

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
            const contactListClone = this.contacts.slice();
            this.contactListChangedEvent.next(contactListClone);
        }
}