import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../service/token.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService) { }

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
    },
  ];

  ngOnInit(): void {
    this.loggedIn = !!this.tokenStorageService.getToken();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
