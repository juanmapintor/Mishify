import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';


  constructor() { }

}
