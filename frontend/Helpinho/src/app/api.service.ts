import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { servidor } from "./app.component";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private httpClient = inject(HttpClient);

	getUserByEmail(email: string) {
		return this.httpClient.get(`${servidor}/users/findByEmail/${email}`);
	}

	saveUser(user: any) {
		return this.httpClient.post(`${servidor}/users/save`, user);
	}

	signIn(user: any) {
		return this.httpClient.post(`${servidor}/users/signIn`, user);
	}

	searchHelpinho(body: any) {
		return this.httpClient.post(`${servidor}/helpinho/search`, body);
	}

	findHelpinhoById(id: number) {
		return this.httpClient.get(`${servidor}/helpinho/${id}`);
	}

	findHelpinhoByUser(id: number) {
		return this.httpClient.get(`${servidor}/helpinho/findAllByUser/${id}`);
	}

	updateUserHelpinhosCreated(id: number) {
		return this.httpClient.get(`${servidor}/users/updateUserHelpinhosCreated/${id}`);
	}

	saveHelpinho(helpinho: any) {
		return this.httpClient.post(`${servidor}/helpinho/save`, helpinho);
	}

	deleteHelpinho(id: number) {
		return this.httpClient.delete(`${servidor}/helpinho/${id}`);
	}
}
