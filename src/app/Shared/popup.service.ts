import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }
  makeCapitalPopup(data: any): string {
    return `` +
      `<div>Capital: ${ data.name }</div>` +
      `<div>State: ${ data.state }</div>` +
      `<div>Population: ${ data.population }</div>`
   }//this function create popup that contain data from the GeoJson file in  assets/data folder.

}
