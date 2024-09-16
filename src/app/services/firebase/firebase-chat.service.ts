import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection,collectionData, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChatService {

  collectionName:string = 'chat';
  constructor(private firestore:Firestore) { }

  getConversation() {
    try {
      const chatCollection = collection(this.firestore, this.collectionName);
      return collectionData(chatCollection) as Observable<any[]>;
    } catch(err:any) {
      throw Error(err)
    }
  }

  sendMessage(data:any) {
    try {
      data.createdAt = serverTimestamp();
      data.updatedAt = serverTimestamp();
      const chatCollection = collection(this.firestore, this.collectionName);
      return addDoc(chatCollection, data)
    } catch(err:any) {
      throw Error(err)
    }
  }
}
