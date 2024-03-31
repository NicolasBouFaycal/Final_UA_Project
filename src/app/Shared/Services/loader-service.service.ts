import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  private isStillLoading: boolean = false;

  constructor() { }

  public show() {
    this.isLoadingSubject.next(true);
  }

  public hide() {
    this.isLoadingSubject.next(false);
  }
}
