import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Event} from './event';
import {MessageService} from './message.service';
import {Client} from './client';
import {Location} from './location';
import {Supplier} from './supplier';
import {Supply} from './supply';
import {userid} from './login/login.component';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})

export class DbService {

    private apiEventURL = 'http://127.0.0.1:5000/event/';  // URL to web api
    private apiClientURL = 'http://127.0.0.1:5000/client/';
    private apiLocationURL = 'http://127.0.0.1:5000/location/';
    private apiSupplierURL = 'http://127.0.0.1:5000/supplier/';
    private apiSupplyURL = 'http://127.0.0.1:5000/supply/';
    private apiMultiURL = 'http://127.0.0.1:5000/multi/';

    constructor(private http: HttpClient, private messageService: MessageService) {
    }

    private log(message: string) {
        this.messageService.add(`DbService: ${message}`);
    }

    /* Event */

    /** GET events from the server */
    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(this.apiEventURL + 'select')
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                map(res => res.map((item) => new Event([], item))),
                tap(_ => {
                    console.log(typeof _);
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Event[]>('getEvent', []))
            );
    }

    /** POST events from the server */
    postEvents(requestBody: any): Observable<Event[]> {
        return this.http.post<Event[]>(this.apiEventURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid event');
                    }
                }),
                map(res => res.slice(1).map((item) => new Event(res[0], item))),
                tap(_ => {
                    console.log(typeof _);
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Event[]>('getEvent', []))
            );
    }

    /** Search (POST) events from the server */
    searchEvents(requestBody: any): Observable<Event[]> {
        return this.http.post<Event[]>(this.apiMultiURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid event');
                    }
                }),
                map(res => res.slice(1).map((item) => new Event(res[0], item))),
                tap(_ => {
                    console.log(typeof _);
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Event[]>('getEvent', []))
            );
    }

    updateEvent(requestBody: any, url: string = ''): Observable<string> {
        return this.http.put<Response>(this.apiEventURL + url + 'update', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    insertEvent(requestBody: any): Observable<string> {
        return this.http.put<Response>(this.apiEventURL + 'insert', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    deleteEvent(requestBody: any): Observable<string> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: requestBody
        };
        return this.http.delete<Response>(this.apiEventURL + 'delete', options)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    /** Find next event id */
    findNextEventID(): Observable<number> {
        return this.http.get<number>(this.apiEventURL + 'id').pipe(
            catchError(this.errorHandler),
            tap(res => {
                console.log(res);
            }),
            map(res => res['data'])
        );
    }

    /* Supplier */

    /** GET all suppliers */
    getSupplier(): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(this.apiSupplierURL + 'select')
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                map(res => res.map((item) => new Supplier([], item))),
                tap(_ => {
                    this.log('fetched supplier with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Supplier[]>('getSupplier', []))
            );
    }

    /** Search (POST) suppliers from the server */
    searchSuppliers(requestBody: any): Observable<Supplier[]> {
        return this.http.post<Supplier[]>(this.apiMultiURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid suppliers');
                    }
                }),
                map(res => res.slice(1).map((item) => new Supplier(res[0], item))),
                tap(_ => {
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Supplier[]>('getEvent', []))
            );
    }

    insertSupplier(requestBody: any, url: string = ''): Observable<string> {
        return this.http.put<Response>(this.apiSupplierURL + url + 'insert', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }


    /** Update Supplier info */
    updateSupplier(requestBody: any, url: string = ''): Observable<string> {
        return this.http.put<Response>(this.apiSupplierURL + url + 'update', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    /* supply */
    /** GET all suppliers */
    findNextSupplierID(): Observable<number> {
        return this.http.get<number>(this.apiSupplierURL + 'id').pipe(
            catchError(this.errorHandler),
            tap(res => {
                console.log(res);
            }),
            map(res => res['data'])
        );
    }

    getSupply(): Observable<Supply[]> {
        return this.http.get<Supply[]>(this.apiSupplyURL + 'select')
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                map(res => res.map((item) => new Supply([], item))),
                tap(_ => {
                    this.log('fetched supply with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Supply[]>('getSupply', []))
            );
    }

    /** Search (POST) suppliers from the server */
    searchSupply(requestBody: any): Observable<Supply[]> {
        return this.http.post<Supply[]>(this.apiMultiURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid supplies');
                    }
                }),
                map(res => res.slice(1).map((item) => new Supply(res[0], item))),
                tap(_ => {
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Supply[]>('getEvent', []))
            );
    }

    insertSupply(requestBody: any): Observable<string> {
        return this.http.put<Response>(this.apiSupplyURL + 'insert', requestBody, httpOptions)
            .pipe(
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }


    /** Update Supplier info */
    updateSupply(requestBody: any): Observable<string> {
        return this.http.put<Response>(this.apiSupplyURL + 'update', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    deleteSupply(requestBody: any): Observable<string> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: requestBody
        };
        return this.http.delete<Response>(this.apiSupplyURL + 'delete', options)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    /* location */

    /** Find next location id */
    findNextLocationID(): Observable<number> {
        return this.http.get<number>(this.apiLocationURL + 'id').pipe(
            catchError(this.errorHandler),
            tap(res => {
                console.log(res);
                }),
            map(res => res['data'])
        );
    }

    /** Insert a location */
    insertLocation(requestBody: any): Observable<string> {
        return this.http.put<Response>(this.apiLocationURL + 'insert', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    /** Update a location */
    updateLocation(requestBody: any, url: string = ''): Observable<string> {
        return this.http.put<Response>(this.apiLocationURL + url + 'update', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }


    /** GET all locations */
    getLocations(): Observable<Location[]> {
        return this.http.get<Location[]>(this.apiLocationURL + 'select')
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                map(res => res.map((item) => new Location([], item))),
                tap(_ => {
                    this.log('fetched locations with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Location[]>('getLocation', []))
            );
    }

    /** Search (POST) locations from the server */
    searchLocations(requestBody: any): Observable<Location[]> {
        return this.http.post<Location[]>(this.apiLocationURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid location');
                    }
                }),
                map(res => res.slice(1).map((item) => new Location(res[0], item))),
                tap(_ => {
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Location[]>('getEvent', []))
            );
    }

    /** Search (POST) locations from the server */
    searchLocationsJoin(requestBody: any): Observable<number> {
        return this.http.post<number>(this.apiMultiURL + 'join', requestBody, httpOptions)
            .pipe(
                map(data => data['data']
                ),
                tap(res => {
                    if (res.length < 2) {
                        throw new Error('no valid response');
                    }
                }),
                map(res => res[1][0]),
                tap(_ => {
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<number>('getEvent', 0))
            );
    }

    /** Get all clients */
    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.apiClientURL + 'select')
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                map(res => res.map((item) => new Client([], item))),
                tap(_ => {
                    this.log('fetched clients with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Client[]>('getClient', []))
            );
    }

    /* client */

    findNextClientID(): Observable<number> {
        return this.http.get<number>(this.apiClientURL + 'id').pipe(
            catchError(this.errorHandler),
            tap(res => {
                console.log(res);
            }),
            map(res => res['data'])
        );
    }

    /** Get one client's info with given ID */
    getClient(id: string): Observable<Client> {
        const requestBody = {
            'where': {
                'ClientID': '= \'' + id + '\''
            }
        };
        return this.http.post<Client>(this.apiClientURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('not valid client');
                    }
                }),
                map(res => new Client(res[0], res[1])),
                tap(_ => {
                    this.log('fetched client with values' + JSON.stringify(_));
                }),
            );
    }

    /** Search (POST) client from the server */
    searchClients(requestBody: any): Observable<Client[]> {
        return this.http.post<Client[]>(this.apiMultiURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid client');
                    }
                }),
                map(res => res.slice(1).map((item) => new Client(res[0], item))),
                tap(_ => {
                    console.log(typeof _);
                    this.log('fetched clients with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Client[]>('getEvent', []))
            );
    }

    /** Search (POST) events from the server */
    searchClientsJoin(requestBody: any): Observable<Client[]> {
        return this.http.post<Client[]>(this.apiMultiURL + 'join', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid client');
                    }
                }),
                map(res => res.slice(1).map((item) => new Client(res[0], item))),
                tap(_ => {
                    console.log(typeof _);
                    this.log('fetched clients with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Client[]>('getEvent', []))
            );
    }

    /** Update Client info */
    updateClient(requestBody: any): Observable<string> {
        return this.http.put<Response>(this.apiClientURL + 'update', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    insertClient(requestBody: any): Observable<string> {
        return this.http.put<Response>(this.apiClientURL + 'insert', requestBody, httpOptions)
            .pipe(
                catchError(this.errorHandler),
                tap(res => {
                    console.log(res);
                }),
                map(res => res.toString()),
            );
    }

    /* multi-search */
    searchMulti(requestBody: any): Observable<Array<string>> {
        return this.http.post<Array<string>>(this.apiMultiURL + 'select', requestBody, httpOptions)
            .pipe(
                tap(_ => console.log(_)),
                map(data => data['data']
                ),
                tap(res => {
                    console.log(res);
                    if (res.length < 2) {
                        throw new Error('no valid result');
                    }
                }),
                map(res => res.slice(1).map((item) => item.toString().replace(/\(|\)|"/g, '')
                    .split(',').map(String))),
                tap(_ => {
                    console.log(typeof _);
                    this.log('fetched events with values' + JSON.stringify(_));
                }),
                catchError(this.handleError<Array<string>>('operation', []))
            );
    }

    /** POST */
    postData(requestBody): Observable<string> {
        /* request body should be like this */
        const data = new FormData();
        data.append('username', 'value');
        data.append('password', 'value');
        const eachProduct = {};
        /* actual post request return Observable<type> and 2 <type> below should be the same type*/
        return this.http.post<string>(this.apiEventURL + 'select', eachProduct, httpOptions)
            .pipe(
                tap(res => { /* actual response */
                    console.log(res);
                }),
                catchError(this.handleError<string>('operation', 'should have type str'))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Error Handling method */
    // TODO: add error handler for every function in this file
    private errorHandler(error: HttpErrorResponse) {
        let message = '';
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            message = 'An error occurred:' + error.error.message;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            message = `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`;
        }
        console.error(message);
        alert('Something bad happened; please try again later.');
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }
}
