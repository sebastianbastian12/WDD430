import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  messages: Message[]=[
    new Message('1', 'Chapel activity','Hello, do we have the activity today?', 'Pepe Perez'),
    new Message('2', 'Chapel activity', 'Yes, it starts at 7 PM, Peter are you going to open the chapel?', 'Pdte. Adams'),
    new Message('3', 'Chapel activity', 'Yes, president I will be there!', 'Pete Parker'),
    new Message('4','Chapel activity','Thank you both', 'Pepe Perez'),
  ]

  onAddMessage(message: Message){
    this.messages.push(message);
  }
}
