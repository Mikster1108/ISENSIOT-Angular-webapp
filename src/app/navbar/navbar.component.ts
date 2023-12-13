import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  expand: boolean = false;
  loggedIn: boolean = false;
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
      display: 'Profile',
      path: '/profile'
    }
  ];

  ngOnInit(): void {
  }

}
