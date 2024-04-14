import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-history-bus',
  templateUrl: './history-bus.component.html',
  styleUrls: ['./history-bus.component.scss']
})
export class HistoryBusComponent implements OnInit {
  public products:any;
  public first = 0;

 public rows = 5;

  constructor(private productService:ProductService){}

  public ngOnInit(): void {
    this.productService.getHistoryBus().then((data:any) => {(this.products = data)
    });
  }

  public refreshTable(){
    this.productService.getHistoryBus().then((data:any) => {(this.products = data)
    });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  pageChange(event:any) {
      this.first = event.first;
      this.rows = event.rows;
  }

  isLastPage(): boolean {
      return this.products ? this.first === this.products.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.products ? this.first === 0 : true;
  }
}
