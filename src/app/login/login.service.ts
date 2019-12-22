import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    url = "http://127.0.0.1:8000/api-token-auth/"
    httpOptions: any;
    
    constructor(private http:HttpClient) { 
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':'application/json'
            })
        }
    }
    
    login(data){
        return this.http.post(this.url, data, this.httpOptions);
    }
}
