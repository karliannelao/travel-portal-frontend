import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
    providedIn: 'root'
})
export class ToursService {
    url = 'http://127.0.0.1:8000/tours/';
    am_url = 'http://127.0.0.1:8000/approving_managers/';
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
        return this.http.get(this.url + id + "/", this.httpOptions);
    }
    
    edit_tour(id, data){
        return this.http.put(this.url + id + "/", data, this.httpOptions);
    }
    
    create_tour(data){
        return this.http.post(this.url, data, this.httpOptions);
    }
    
    get_approving_managers(){
        return this.http.get(this.am_url, this.httpOptions);
    }
    
}
