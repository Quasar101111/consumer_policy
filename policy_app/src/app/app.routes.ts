import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddPolicyComponent } from './add-policy/add-policy.component';
import { ViewPolicyComponent } from './view-policy/view-policy.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
export const routes: Routes = [

    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'logout',component:LogoutComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'home',component:HomeComponent},
    {path:'navbar',component:NavbarComponent},
    {path:'add-policy',component:AddPolicyComponent},
    {path:'view-policy',component:ViewPolicyComponent},
    {path:'change-password',component:ChangePasswordComponent}

];
