import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  
  private  url = './assets/pizza.json';

  constructor(private http: HttpClient) { }
  
  getAllPizza(): Observable<any> {
    return this.http.get(this.url);
  }
  
}
