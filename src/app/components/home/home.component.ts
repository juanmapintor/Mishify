import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host:{
    class: 'h-100 w-100'
  }
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
