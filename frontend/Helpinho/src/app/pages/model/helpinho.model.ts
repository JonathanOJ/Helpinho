import { UserModel } from "./user.model";
import { UserDonatedModel } from "./userDonated.model";

export class HelpinhoModel {
	id: number = 0;
	title: string = "";
	description: string = "";
	image: string = "";
	category: string[] = [];
	users_donated: UserDonatedModel[] = [];
	value: number = 0;
	request_emergency: boolean = false;
	emergency: boolean = false;
	user_responsable: UserModel = new UserModel();
	createdat: Date | null = null;
}
