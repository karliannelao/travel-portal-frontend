import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ToursComponent } from "./tours/tours.component";

const routes: Routes = [
  { path: '', component: ToursComponent },
  { path: 'login', component: LoginComponent },
];

export const routing = RouterModule.forRoot(routes);
