import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../Services/loader-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public isLoading: boolean = false;

  constructor(private loaderService: LoaderService){}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
}
