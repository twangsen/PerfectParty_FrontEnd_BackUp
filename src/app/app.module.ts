import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,
    MatDialogModule, MatListModule, MatTableModule, MatOptionModule, MatSelectModule
} from '@angular/material';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EventsComponent, EventsDialogComponent} from './events/events.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessagesComponent} from './messages/messages.component';
import {HomeComponent} from './home/home.component';
import {ClientComponent} from './client/client.component';
import {BookComponent, BookDialogComponent} from './book/book.component';
import {SearchComponent} from './search/search.component';
import {SampleComponent} from './sample/sample.component';
import {LoginComponent, LoginDialogComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {AdminsupplierComponent, AdminSupplierDialogComponent} from './adminsupplier/adminsupplier.component';
import {AdminclientComponent, AdminclientDialogComponent} from './adminclient/adminclient.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AdminlocationComponent, AdminlocationDialogComponent} from './adminlocation/adminlocation.component';

@NgModule({
    declarations: [
        AppComponent,
        EventsComponent,
        EventsDialogComponent,
        MessagesComponent,
        HomeComponent,
        ClientComponent,
        BookComponent,
        BookDialogComponent,
        SearchComponent,
        SampleComponent,
        LoginComponent,
        LoginDialogComponent,
        AdminComponent,
        AdminsupplierComponent,
        AdminSupplierDialogComponent,
        AdminclientComponent,
        AdminclientDialogComponent,
        AdminlocationComponent,
        AdminlocationDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatToolbarModule,
        MatDialogModule,
        MatButtonModule,
        MatListModule,
        MatTableModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        AdminclientDialogComponent,
        AdminSupplierDialogComponent,
        AdminlocationDialogComponent,
        BookDialogComponent,
        LoginDialogComponent,
        EventsDialogComponent
    ]
})
export class AppModule {
}
