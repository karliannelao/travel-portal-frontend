import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  currentUrl: string;
  
  constructor(private router:Router){
    router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd){
          this.currentUrl = event.url.split('/')[1];
        }
      })

  }
  
  ngOnInit(){
  }
}
