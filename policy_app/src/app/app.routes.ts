import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [

    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'logout',component:LogoutComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
