import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { servidor } from "./app.component";
import { UserDonatedModel } from "./pages/model/userDonated.model";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private httpClient = inject(HttpClient);

	getUserByEmail(email: string) {
		return this.httpClient.get(`${servidor}/users/findByEmail/${email}`);
	}

	getUserById(userId: string) {
		return this.httpClient.get(`${servidor}/users/findById/${userId}`);
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

	findHelpinhoById(id: string) {
		return this.httpClient.get(`${servidor}/helpinho/${id}`);
	}

	findHelpinhoByUser(id: string) {
		return this.httpClient.get(`${servidor}/helpinho/findAllByUser/${id}`);
	}

	updateUserHelpinhosCreated(id: string) {
		return this.httpClient.get(`${servidor}/users/updateUserHelpinhosCreated/${id}`);
	}

	saveHelpinho(helpinho: any) {
		return this.httpClient.post(`${servidor}/helpinho/save`, helpinho);
	}

	deleteHelpinho(id: string) {
		return this.httpClient.delete(`${servidor}/helpinho/${id}`);
	}

	donateHelpinho(body: UserDonatedModel) {
		return this.httpClient.post(`${servidor}/helpinho/donate`, body);
	}
}
