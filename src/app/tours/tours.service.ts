import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
    providedIn: 'root'
})
export class ToursService {
    url = 'http://127.0.0.1:8000/tours/';
    httpOptions: any;
    token: string;
    
    constructor(private http:HttpClient, private sessionStorageService:SessionStorageService) { 
        this.token = this.sessionStorageService.get('token');
        console.log(this.token);
        this.httpOptions = {
            headers: new HttpHeaders({
                "Content-Type":  "application/json",
                "Authorization": "Token " + this.token,
            })
        }

    }
    
    get_tours(){
        return this.http.get(this.url, this.httpOptions);
    }
    
    get_tour(id){
        return this.http.get(this.url + id + "/", this.httpOptions)
    }
    
}
