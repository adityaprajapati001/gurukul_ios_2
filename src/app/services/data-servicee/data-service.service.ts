import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private messageSource = new BehaviorSubject<any>(null);
  currentData = this.messageSource.asObservable();

  private indexQuizContentSource = new BehaviorSubject<any>(null);
  indexQuizContent = this.indexQuizContentSource.asObservable();

  constructor() { }

  setData(data: string) {
    this.messageSource.next(data)
  }

  setIndexActivityContent(data: string) {
    this.indexQuizContentSource.next(data)
  }
}
