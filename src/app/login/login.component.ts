import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService],
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;

  constructor(private formBuilder:FormBuilder, private sessionStorageService:SessionStorageService, private router:Router,
              private loginService:LoginService) {
  }

  ngOnInit() {
    this.sessionStorageService.clear();
    this.loginForm = this.formBuilder.group({
        username:["", Validators.required],
        password:["", Validators.required],
    });
  }
  
  onSubmit(){
    var username = this.loginForm.controls.username.value;
    var password = this.loginForm.controls.password.value;
    
    this.loginService.login({username: username, password: password})
        .subscribe( data => {
            this.sessionStorageService.set('token', data['token']);
            this.sessionStorageService.set('userid', data['id']);
            this.sessionStorageService.set('username', data['username']);
            this.sessionStorageService.set('position', data['position']);
            this.router.navigate(['']);
        }, err => {
            console.log(err)
        });
  }

}
