import { Component, inject, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";

export const servidor = environment.servidor;

@Component({
	selector: "app-root",
	template: ` <router-outlet /> `,
	styles: [],
})
export class AppComponent implements OnInit {
	title = "Helpinho";

	private router = inject(Router);

	ngOnInit(): void {
		const rememberUser = sessionStorage.getItem("rememberUser");

		if (!rememberUser) {
			sessionStorage.removeItem("userId");
			this.router.navigate(["/login"]);
		}
	}
}
