import { UserModel } from "./user.model";
import { UserDonatedModel } from "./userDonated.model";

export class HelpinhoModel {
	helpinhoId: string = "";
	title: string = "";
	description: string = "";
	image: string = "";
	category: string[] = [];
	users_donated: UserDonatedModel[] = [];
	value_required: number = 0;
	value_donated: number = 0;
	request_emergency: boolean = false;
	emergency: boolean = false;
	user_responsable: UserModel = new UserModel();
	created_at: Date | null = null;
}
