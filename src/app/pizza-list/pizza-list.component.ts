import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.scss']
})
export class PizzaListComponent implements OnInit {

  @Input('toppings') toppings;
  @Input('pizzaSize') pizzaSize;
  @Output() toppingSelect = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
   
  }

  public onToppingSelect(toppings: string, name: string, isChecked: boolean) {
    let size = this.pizzaSize;
    this.toppingSelect.emit({size, toppings, name, isChecked});
  }



}
