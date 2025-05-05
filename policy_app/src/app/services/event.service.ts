import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private welcomeMsg= new BehaviorSubject<number>(0);
  welMsgs= this.welcomeMsg.asObservable();

  sendWelcomeMessage(value:number){
    this.welcomeMsg.next(value);
  }

}
