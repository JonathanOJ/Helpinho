import { Component } from "@angular/core";
import { environment } from "../environments/environment";

export const servidor = environment.servidor;

@Component({
	selector: "app-root",
	template: ` <router-outlet /> `,
	styles: [],
})
export class AppComponent {
	title = "Helpinho";
}
