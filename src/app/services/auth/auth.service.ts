/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/member-ordering */
/* IMPORTS */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ObservablesService } from '../observable/observable.service';

import { UserModel } from '../../models/user.model';

import { environment } from '../../../environments/environment';


/* DEFINITION & EXPORT */
@Injectable( { providedIn: 'root' } )
export class AuthService {

    // DEPENDENCIES INJECTION
    constructor(
        private HttpClient: HttpClient,
        private ObservablesService: ObservablesService) { }


    // METHODS
    // request headers settings
    private setHeaders = () => {
        // set header
        const myHeader = new HttpHeaders();
        myHeader.append('Content-Type', 'application/json');
        myHeader.append('Accept', 'application/json');

        // return header
        return { headers: myHeader };
    };

    // log in user
    public loginUser(credentials: string): Promise<any> {
        // console.log('creds ' + credentials);
        // alert(credentials.toString() + '....');
        // make an HTTP POST call

        return this.HttpClient.post(
            'http://localhost:8080/authenticate', credentials, this.setHeaders())
            .toPromise()
            .then(data => this.getData(data))
            .catch(this.handleError);
    }

    // register user
    public registerUser(user: UserModel): Promise<any> {
        // make an HTTP POST call
        return this.HttpClient.post(`${environment.authApiUrl}/register`, user, this.setHeaders())
            .toPromise()
            .then(data => this.getData(data))
            .catch(this.handleError);
    }

    // get user information
    public getCurrentUserInfo(token: object): Promise<any> {
        console.log(token);
        return this.HttpClient.post(`${environment.authApiUrl}/`, token, this.setHeaders())
            .toPromise()
            .then((data) => this.getData(data))
            .catch(this.handleError);
    }

    // get api response
    private getData = (apiResponse: any) => {
        this.ObservablesService.setObservableData('user', apiResponse.username);
        this.ObservablesService.setObservableData('bookmarks', apiResponse.favourites);
        this.ObservablesService.setObservableData('token', apiResponse.token);

        // set local storage
        // localStorage.setItem('bookmarks', JSON.stringify(apiResponse.farourites));
        localStorage.setItem('token', JSON.stringify(apiResponse.token));

        // Return data
        return apiResponse || {};
    };

    // handle api response error
    private handleError = (apiError: any) => Promise.reject(apiError.error);

}
