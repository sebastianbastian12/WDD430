import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail implements OnInit{

  contact: Contact;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
     this.route.params
        .subscribe (
          (params: Params) => {
            this.id = params['id']
            this.contact = this.contactService.getContact(this.id);
          }
        )
  }

  onDelete() {
   this.contactService.deleteContact(this.contact);
   this.router.navigateByUrl('/contacts');
  }
  
}
