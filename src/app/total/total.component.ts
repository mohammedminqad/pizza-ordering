import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss']
})
export class TotalComponent implements OnInit {
  @Input('totalData') totalData;
  constructor() { }

  ngOnInit() {
    console.log(this.totalData);
  }

}
