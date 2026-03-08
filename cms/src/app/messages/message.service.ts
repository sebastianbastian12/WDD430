import { EventEmitter, Injectable } from "@angular/core";
import { Message } from "./message.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";


  @Injectable ({
    providedIn: 'root'
})

export class MessageService {
    messageChangedEvent = new EventEmitter<Message[]>();
    private messages: Message [] = [];
    maxMessageId: number;

    constructor(private http: HttpClient){
        this.getMessages();
    }

    getMessages(){
        this.http.get<Message[]>('https://cms-database-32de3-default-rtdb.firebaseio.com/messages.json')
            .subscribe(
                (messages: Message[]) => {
                    this.messages = messages ? messages : [];
                    this.maxMessageId = this.getMaxId();
                    this.messageChangedEvent.emit(this.messages.slice());
                },
            (error: any) => {
                console.error('Error fetching messages:', error);
            }
        )
    }

    storeMessages() {
        const messagesString = JSON.stringify(this.messages);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put(
            'https://cms-database-32de3-default-rtdb.firebaseio.com/messages.json',
            messagesString,
            {headers: headers}
        )

        .subscribe(() => {
            this.messageChangedEvent.emit(this.messages.slice());
        })
    }

    getMaxId(): number {
        let maxId = 0;
        for ( const message of this.messages){
            const currentId = parseInt(message.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }
        return maxId;
    }



    getMessage(id:string): Message {
        return this.messages.find(m => m.id === id) || null;
    }

    addMessage(message: Message){
      if (!message) return;

      this.maxMessageId++;
      message.id = this.maxMessageId.toString();
      this.messages.push(message);

      this.storeMessages();
    }
}