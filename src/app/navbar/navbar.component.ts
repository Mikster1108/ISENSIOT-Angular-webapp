import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  navItems = [
    {
      display: 'Home',
      path: '/home'
    },
    {
      display: 'Recordings',
      path: '/recordings'
    },
    {
      display: 'Live Camera',
      path: '/live-camera'
    },
    {
      display: 'Skibidi',
      path: '/skoob'
    }
  ];

  ngOnInit(): void {
  }

}
