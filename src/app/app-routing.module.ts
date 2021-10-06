import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent} from './book/book.component';
import { ClientComponent } from './client/client.component';
import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';
import {SearchComponent} from './search/search.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {AdminsupplierComponent} from './adminsupplier/adminsupplier.component';
import {AdminclientComponent} from './adminclient/adminclient.component';
import {AdminlocationComponent} from './adminlocation/adminlocation.component';

const routes: Routes = [
  { path : '', component : LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: ClientComponent},
  { path: 'event', component: EventsComponent },
  { path: 'home', component: HomeComponent},
  { path: 'book', component: BookComponent },
  { path: 'search', component: SearchComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/event', component: EventsComponent },
  { path: 'admin/client', component: AdminclientComponent },
  { path: 'admin/supplier', component: AdminsupplierComponent },
  { path: 'admin/location', component: AdminlocationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
