import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserModel } from "../model/user.model";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ApiService } from "../../api.service";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";

@Component({
	selector: "h-home",
	templateUrl: "./home.component.html",
	providers: [MessageService],
	styles: [
		`
			::ng-deep .p-button.p-button-rounded {
				border-radius: 16px;
				padding: 12px 20px;
			}

			::ng-deep .p-button-label {
				font-size: 16px;
				font-weight: 500;
			}

			.marquee-container {
				width: 100%;
				white-space: nowrap;
				box-sizing: border-box;
			}
		`,
	],
})
export class HomeComponent implements OnInit, OnDestroy {
	private router = inject(Router);
	private breakpointObserver = inject(BreakpointObserver);
	private api = inject(ApiService);
	private toastService = inject(MessageService);

	activeIndex: number = 0;
	isMobile: boolean = false;

	userSession: UserModel = new UserModel();
	userId: string = sessionStorage.getItem("userId") || "";

	getUserLoggedSub: Subscription = new Subscription();

	messagesInicialHome = [
		{
			title: "Escolha",
			detail: "Escolha um helpinho que deseja ajudar",
		},
		{
			title: "Doe",
			detail: "O valor é você quem decide, e ele vai <span class='text-[#ec4899]'>todo</span> para quem escolher",
		},
		{
			title: "Aproveite",
			detail: "Doar gera felicidade para você e para quem recebeu.",
		},
		{
			title: "Acompanhe",
			detail: "Fique ligado, acompanhe se o helpinho alcançou o objetivo.",
		},
	];

	tagsMessages = [
		{
			title: "Registro grátis",
		},
		{
			title: "Sem taxas",
		},
		{
			title: "Rápido e prático",
		},
	];

	ngOnInit() {
		switch (this.router.url) {
			case "/home/pesquisa":
				this.activeIndex = 1;
				this.handleActiveTab(1);
				break;
			case "/home/sobre":
				this.activeIndex = 2;
				this.handleActiveTab(2);
				break;
			default:
				this.handleActiveTab(0);
				break;
		}
		this.handleWindowSize();

		if (this.isMobile) {
			this.tagsMessages = this.tagsMessages.concat(this.tagsMessages);
		}

		this.getUserLogged();
	}

	ngOnDestroy() {
		this.getUserLoggedSub ? this.getUserLoggedSub.unsubscribe() : "";
	}

	getUserLogged() {
		if (sessionStorage.getItem("userId")) {
			const userId: string = sessionStorage.getItem("userId") || "";

			this.getUserLoggedSub = this.api.getUserById(userId).subscribe({
				next: (resp: any) => {
					this.userSession = resp;
				},
				error: () => {
					this.toastService.add({ severity: "error", summary: "", detail: "Erro ao carregar usuário!" });
				},
			});
		}
	}

	handleWindowSize() {
		this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
			this.isMobile = result.matches;
		});
	}

	redirectToRegister() {
		this.router.navigate(["/register"]);
	}

	handleActiveTab(index: number) {
		let section;

		switch (index) {
			case 0:
				section = document.getElementById("home");
				break;
			case 1:
				section = document.getElementById("pesquisa");
				break;
			case 2:
				section = document.getElementById("sobre");
				break;
			case 3:
				this.router.navigate(["/helpinhos"]);
				break;
		}

		if (index == 0) {
			section ? section.scrollTo({ behavior: "smooth" }) : "";
		} else {
			section ? section.scrollIntoView({ behavior: "smooth" }) : "";
		}
	}

	handleTabChange(index: number) {
		this.activeIndex = index;
		this.handleActiveTab(index);
	}

	getValueFormatted(value: number): string {
		if (value === null || value === undefined || isNaN(value)) return "0";

		let formattedValue = value.toFixed(2);

		formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

		formattedValue = formattedValue.replace(".", ",");

		return formattedValue;
	}
}
