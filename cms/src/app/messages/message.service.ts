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
        this.http.get<{message: String, messages: Message[]}>('http://localhost:3000/messages')
            .subscribe(
                (responseData) => {
                    this.messages = responseData.messages;
                    this.sortAndSend();
                },
                (error: any) => {
                    console.log(error);
                }
            );
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

    sortAndSend(){
        this.messageChangedEvent.next(this.messages.slice());
   }



    getMessage(id:string): Message {
        return this.messages.find(m => m.id === id) || null;
    }


    addMessage(message: Message){
        if (!message) {
            return;
        }
    
        message.id = ''

        const headers = new HttpHeaders ({'Content-Type': 'application/json'});

        this.http.post<{ message: String, newMessage: Message}> (
            'http://localhost:3000/messages',
            message,
            { headers: headers}
        )
        .subscribe(
            (responseData) => {
                this.messages.push(responseData.newMessage);
                this.sortAndSend();
            }
        );
    }
}