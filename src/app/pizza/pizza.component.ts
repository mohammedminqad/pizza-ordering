import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { PizzaService } from '../pizza-service/pizza.service';
import { Toppings } from '../models/toppings';
@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss']
})
export class PizzaComponent implements OnInit {

  private pizzaSizePrice = {
    'small': 5,
    'medium': 7,
    'large': 8,
    'extraLarge': 9
  };
  public vegToppings: Toppings;
  public nonVegToppings: Toppings;
  public smallSize = 1;
  public mediumSize = 1;
  public largeSize = 1;
  public extraLargeSize = 1;
  public total;
  private toppingName = [];

  pizzaForm: FormGroup;

  constructor(private fb: FormBuilder, private svc: PizzaService) { }

  ngOnInit() {
    this.pizzaForm = this.fb.group({
      small: this.fb.array([]),
      medium: this.fb.array([]),
      large: this.fb.array([]),
      extraLarge: this.fb.array([]),
      smallSize: new FormControl(1),
      mediumSize: new FormControl(1),
      largeSize: new FormControl(1),
      extraLargeSize: new FormControl(1)
    });

    this.svc.getAllPizza().subscribe(data => {
      this.vegToppings = data[0].vegTopings;
      this.nonVegToppings = data[1].nonVegTopings;
    })

    this.total = {
      'smallTotal': '',
      'mediumTotal': '',
      'largeTotal': '',
      'extraLargeTotal': '',
      'mediumPizzaOfferPrice': '',
      'largePizzaOfferPrice': ''
    }

  }

  public onToppingSelect($event) {
    this.controlForm($event);
    this.showTotal($event.size);

  }
  private showTotal(size) {
    this.checkOffer(size);
    switch (size) {
      case 'small':
        this.total.smallTotal = this.calculateTotalPrice(size, 'smallSize');
        break;
      case 'medium':
        this.total.mediumTotal = this.calculateTotalPrice(size, 'mediumSize');
        break;
      case 'large':
        this.total.largeTotal = this.calculateTotalPrice(size, 'largeSize');
        break;
      case 'extraLarge':
        this.total.extraLargeTotal = this.calculateTotalPrice(size, 'extraLargeSize');
        break;
    }

  }
  private calculatePrice(priceArray) {
    return priceArray.reduce((sum, number) => {
      return sum + number
    }, 0)
  }

  private calculateTotalPrice(size, qty) {
    return (this.pizzaForm.value[qty] * this.pizzaSizePrice[size]) + this.calculatePrice(this.pizzaForm.value[size]);
  }

  public onQtyChange(size, $event) {
    this.pizzaForm.controls[size + 'Size'].patchValue($event.target.value);
    this.showTotal(size);
  }

  private checkOffer(size) {

    if (size === 'medium') {
      let qty = this.pizzaForm.controls[size + 'Size'].value;
      let toppings = this.pizzaForm.controls[size].value.length;
      if (qty == '1' && toppings === 2) {
        this.total.mediumPizzaOfferPrice = 5;
      }
      else if (qty == '2' && toppings === 4) {
        this.total.mediumPizzaOfferPrice = 9;
      } else {
        this.total.mediumPizzaOfferPrice = null
      }
    }
    if (size === 'large') {
      let qty = this.pizzaForm.controls[size + 'Size'].value,
      toppings = this.pizzaForm.controls[size].value,
      toppingsLength = toppings.length
      if (qty == '1') {
        if (this.toppingName.includes('Barbecue chicken') && this.toppingName.includes('Pepperoni') && toppingsLength === 2) {
           this.largePizzaOffer(size, toppings);
        } else if (!this.toppingName.includes('Barbecue chicken') && !this.toppingName.includes('Pepperoni') && toppingsLength === 4) {
           this.largePizzaOffer(size, toppings);
        }
        else {
          this.total.largePizzaOfferPrice = null;
        }
      }
    }
  }
  private largePizzaOffer(size, toppings) {
    return this.total.largePizzaOfferPrice = ((this.pizzaSizePrice[size]+this.calculatePrice(toppings))*50)/100;

  }
  private controlForm(topping) {

    let size = <FormArray>this.pizzaForm.controls[topping.size];
    if (topping.isChecked) {
      size.push(new FormControl(topping.toppings));
      this.toppingName.push(topping.name);
    } else {
      let index = size.controls.findIndex(x => x.value == topping.toppings)
      size.removeAt(index);
      let i = this.toppingName.indexOf(topping.name);
      this.toppingName.splice(i, 1);
    }
  }


}
