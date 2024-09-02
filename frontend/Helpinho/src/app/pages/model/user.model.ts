export class UserModel {
	id: number = 0;
	username: string = "";
	email: string = "";
	image: string = "";
	password: string = "";
	cpf_cnpj: string = "";
	birthdate: Date | null = null;
	total_donated: number = 0;
	total_helpinhos_donated: number = 0;
	total_helpinhos_created: number = 0;
	createdAt: Date | null = null;
}
