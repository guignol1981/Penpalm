import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ModuleWithProviders} from '@angular/core';


const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: HomeComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes ,{useHash: false});