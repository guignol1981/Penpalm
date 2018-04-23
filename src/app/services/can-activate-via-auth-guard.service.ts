import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class CanActivateViaAuthGuardService {

    constructor(private authenticationService: AuthenticationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authenticationService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
        return this.authenticationService.isLoggedIn();
    }

}
