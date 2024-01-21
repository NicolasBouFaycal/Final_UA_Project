import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  replaySubject = new ReplaySubject<number>(2); // Buffer size of 2
 
  ngOnInit() {

    };
}

