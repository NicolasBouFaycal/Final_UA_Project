import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './Services/shared.service';
import { LoaderComponent } from './loader/loader.component';


@NgModule({
  declarations: [
    LoaderComponent
  ],
  exports:[
    LoaderComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[SharedService]
})
export class SharedModule { }
