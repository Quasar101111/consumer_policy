import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddPolicyComponent } from './add-policy/add-policy.component';
import { ViewPolicyComponent } from './view-policy/view-policy.component';
import { ManagePolicyComponent } from './manage-policy/manage-policy.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from './guard/auth.guard';
export const routes: Routes = [

    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'logout',component:LogoutComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
    {path:'navbar',component:NavbarComponent,canActivate:[AuthGuard]},
    {path:'add-policy',component:AddPolicyComponent,canActivate:[AuthGuard]},
    {path:'view-policy',component:ViewPolicyComponent,canActivate:[AuthGuard]},
    {path:'manage-policy',component:ManagePolicyComponent,canActivate:[AuthGuard]},
    {path:'change-password',component:ChangePasswordComponent,canActivate:[AuthGuard]}

];
