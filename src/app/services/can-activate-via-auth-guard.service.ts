import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class CanActivateViaAuthGuardService {

    constructor(private authenticationService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authenticationService.isLoggedIn();
    }

}
