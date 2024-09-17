declare var google: any;
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private router = inject(Router);
	constructor() {}

	signOut() {
		google.accounts.id.disableAutoSelect();
		sessionStorage.removeItem("userId");
		this.router.navigate(["/login"]);
	}
}
