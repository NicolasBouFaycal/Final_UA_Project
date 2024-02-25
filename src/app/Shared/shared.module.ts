import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './Services/shared.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[SharedService]
})
export class SharedModule { }
