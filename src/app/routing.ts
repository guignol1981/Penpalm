import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {ModuleWithProviders} from '@angular/core';
import {CanActivateViaAuthGuardService} from "./services/can-activate-via-auth-guard.service";
import {ConfirmEmailComponent} from './components/confirm-email/confirm-email.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';


const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [CanActivateViaAuthGuardService]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'confirm-email/:link',
        component: ConfirmEmailComponent
    },
    {
        path: 'reset-password/:link',
        component: ResetPasswordComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: LoginComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: false});