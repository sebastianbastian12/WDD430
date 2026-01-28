import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';

import { HeaderComponent } from './header.component';
import { Contacts } from './contacts/contacts';
import { ContactList } from './contacts/contact-list/contact-list';
import { ContactDetail } from './contacts/contact-detail/contact-detail';
import { ContactItem } from './contact-item/contact-item';
import { Documents } from './documents/documents';
import { DocumentList } from './documents/document-list/document-list';
import { DocumentItem } from './documents/document-item/document-item';
import { DocumentDetail } from './documents/document-detail/document-detail';
import { Messages } from './messages/messages';
import { MessageItem } from './messages/message-item/message-item';
import { MessageEdit } from './messages/message-edit/message-edit';
import { MessageList } from './messages/message-list/message-list';
import { appDropdownMenuDirective } from './shared/dropdownMenu.directive';

@NgModule({
  declarations: [
    App,
    HeaderComponent,
    Contacts,
    ContactList,
    ContactDetail,
    ContactItem,
    Documents,
    DocumentList,
    DocumentItem,
    DocumentDetail,
    Messages,
    MessageItem,
    MessageEdit,
    MessageList
  ],
  imports: [
    BrowserModule,
    appDropdownMenuDirective
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
