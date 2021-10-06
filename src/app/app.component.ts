import { Component } from '@angular/core';
import { loggedIn, userid } from './login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Perfect Party';

  loggedin(): boolean {
    return loggedIn;
  }

  getuserID(): string {
    return userid;
  }

  isAdmin(): boolean {
    return userid === 'admin';
  }
}
