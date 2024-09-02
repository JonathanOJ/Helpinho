declare var google: any;
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { Subscription } from "rxjs";
import { UserFeedbackModel } from "../model/userFeedback.model";
import { UserModel } from "../model/user.model";
import { MessageService } from "primeng/api";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styles: [
		`
			::ng-deep .p-button {
				width: 100%;
				padding: 8px;
			}

			::ng-deep .p-inputtext {
				width: 100%;
			}

			@media screen and (max-width: 768px) {
				::ng-deep .p-carousel .p-carousel-content .p-carousel-prev {
					width: 0;
					height: 0;
					margin: 0;
				}

				::ng-deep .p-carousel .p-carousel-content .p-carousel-next {
					width: 0;
					height: 0;
					margin: 0;
				}
			}
		`,
	],
	providers: [MessageService],
})
export class LoginComponent implements OnInit, OnDestroy {
	user: UserModel = new UserModel();
	usersFeedBacks: UserFeedbackModel[] = [
		{
			feedback: "O Helpinho pode mudar a vida de milhões de pessoas todos os dias",
			userName: "Amélie Laurent",
			userCompany: "Web Development Agency",
			userCompanyRole: "Diretora de recursos, ONG",
			image: "./../../../assets/images/imageLogin2.jpeg",
		},
		{
			feedback: "O Helpinho de hoje escreve o nosso amanhã",
			userName: "Julia Rissia",
			userCompany: "Editorar CBA",
			userCompanyRole: "Escritora, Editora chefe",
			image: "./../../../assets/images/ImageLogin1.jpeg",
		},
	];

	isInvalid: boolean = false;
	loading: boolean = false;
	rememberUser: boolean = false;
	createUser: boolean = false;

	private router = inject(Router);
	private api = inject(ApiService);
	private toastService = inject(MessageService);

	loginSub: Subscription = new Subscription();
	getUserByEmailSub: Subscription = new Subscription();

	ngOnInit(): void {
		google.accounts.id.initialize({
			client_id: "654365965724-fpvgg7u58b21kevu4svro6246lf21vfd.apps.googleusercontent.com",
			callback: (response: any) => {
				this.handleLoginWithGoogle(response);
			},
		});

		google.accounts.id.renderButton(document.getElementById("google-btn"), {
			theme: "outline",
			size: "large",
			text: "continue_with",
			logo_alignment: "center",
			shape: "rectangular",
			width: "400",
		});

		this.router.url === "/register" ? (this.createUser = true) : null;

		sessionStorage.getItem("user") ? this.router.navigate(["/home"]) : null;
	}

	ngOnDestroy(): void {
		this.loginSub ? this.loginSub.unsubscribe : null;
		this.getUserByEmailSub ? this.getUserByEmailSub.unsubscribe : null;
	}

	private decodeToken(token: string) {
		return JSON.parse(atob(token.split(".")[1]));
	}

	handleLoginWithGoogle(response: any) {
		if (response.credential) {
			const token = response.credential;
			const user = this.decodeToken(token);
			console.log(user);
			this.getUserByEmail(user);
		}
	}

	getUserByEmail(user: any) {
		this.getUserByEmailSub = this.api.getUserByEmail(user.email).subscribe({
			next: (response: any) => {
				if (response) {
					sessionStorage.setItem("user", JSON.stringify(response));
					this.router.navigate(["/home"]);
				}
			},
			error: () => {
				this.createUserByGoogle(user);
			},
		});
	}

	createUserByGoogle(user: any) {
		this.user = new UserModel();
		this.user.email = user.email;
		this.user.username = user.name;
		this.user.image = user.picture;

		this.createUserAccount();
	}

	handleLogin() {
		this.loading = true;

		this.createUser ? (this.isInvalid = !this.validFormsToCreate()) : (this.isInvalid = !this.validForms());

		if (this.isInvalid) {
			this.loading = false;
			return;
		}

		this.createUser ? this.createUserAccount() : this.signIn();
	}

	signIn() {
		this.loading = true;

		this.loginSub = this.api.signIn(this.user).subscribe({
			next: (response: any) => {
				this.loading = false;
				sessionStorage.setItem("user", JSON.stringify(response));
				this.router.navigate(["/home"]);
			},
			error: () => {
				this.toastService.add({ severity: "error", summary: "", detail: "Email ou senha inválidos!" });
				this.loading = false;
			},
		});
	}

	createUserAccount() {
		this.loading = true;

		this.api.saveUser(this.user).subscribe({
			next: (response: any) => {
				this.loading = false;
				sessionStorage.setItem("user", JSON.stringify(response));
				this.router.navigate(["/home"]);
			},
			error: () => {
				this.loading = false;
				this.toastService.add({ severity: "error", summary: "", detail: "Erro ao criar usuário!" });
			},
		});
	}

	validForms() {
		return this.user.email && this.user.password;
	}

	validFormsToCreate() {
		return this.user.email && this.user.password && this.user.username && this.user.cpf_cnpj && this.user.birthdate;
	}
}
