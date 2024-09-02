import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { ApiService } from "../../api.service";
import { Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { UserModel } from "../model/user.model";
import { HelpinhoModel } from "../model/helpinho.model";

@Component({
	selector: "app-helpinhos",
	templateUrl: "./helpinhos.component.html",
	styles: [
		`
			::ng-deep .p-input-icon-left > .p-inputtext {
				width: 400px;
			}

			::ng-deep .p-stepper .p-stepper-nav {
				width: 50dvw;
				align-self: center;
				border: 1px solid #e7e7e7;
				border-radius: 16px;
			}

			:host ::ng-deep div[role="tablist"] {
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			::ng-deep .p-stepper .p-stepper-panels {
				padding: 0;
				margin: 3rem;
				border-radius: 24px;
			}
		`,
	],
	providers: [MessageService],
})
export class HelpinhosComponent implements OnDestroy, AfterViewInit {
	@ViewChild("dt2") dt2: Table | undefined;

	isMobile: boolean = window.innerWidth < 768;
	visible: boolean = false;
	searchValue: string = "";
	createMode: boolean = false;
	helpinhos: HelpinhoModel[] = [];
	helpinho: HelpinhoModel = new HelpinhoModel();
	selectedItem: HelpinhoModel = new HelpinhoModel();
	userSession: UserModel = new UserModel();

	getHelpinhosSub: Subscription = new Subscription();
	onEditSub: Subscription = new Subscription();
	onDeleteSub: Subscription = new Subscription();

	private api = inject(ApiService);
	private router = inject(Router);
	private toastService = inject(MessageService);

	ngAfterViewInit(): void {
		this.isMobile ? this.router.navigate(["/home"]) : "";

		if (sessionStorage.getItem("user")) {
			this.userSession = JSON.parse(sessionStorage.getItem("user") || "");
			this.getHelpinhos();
		} else {
			this.toastService.add({
				severity: "warn",
				summary: "",
				detail: "Para acessar essa pagina é preciso ter realizado login!",
			});
			setTimeout(() => {
				this.router.navigate(["/"]);
			}, 3000);
		}
	}

	ngOnDestroy(): void {
		this.getHelpinhosSub ? this.getHelpinhosSub.unsubscribe() : "";
		this.onEditSub ? this.onEditSub.unsubscribe() : "";
		this.onDeleteSub ? this.onDeleteSub.unsubscribe() : "";
	}

	getHelpinhos() {
		this.getHelpinhosSub = this.api.findHelpinhoByUser(this.userSession.id).subscribe({
			next: (resp: any) => {
				this.helpinhos = resp;
			},
			error: () => {
				this.helpinhos = [];
				this.toastService.add({ severity: "error", summary: "", detail: "Erro ao carregar helpinhos!" });
			},
		});
	}

	onInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.dt2 ? this.dt2.filterGlobal(inputElement.value || "", "contains") : "";
	}

	clear(table: Table) {
		table.clear();
		this.searchValue = "";
	}

	handleCreateMode() {
		this.createMode = true;
		this.helpinho = new HelpinhoModel();
		this.helpinho.user_responsable = this.userSession;
	}

	handleCancelMode() {
		this.createMode = false;
		this.helpinho = new HelpinhoModel();
	}

	onEdit(id: number) {
		this.createMode = true;
		this.onEditSub = this.api.findHelpinhoById(id).subscribe({
			next: (resp: any) => {
				this.helpinho = resp;
			},
			error: () => {
				this.toastService.add({ severity: "error", summary: "", detail: "Erro ao carregar helpinho!" });
			},
		});
	}

	onDelete(id: number) {
		this.onDeleteSub = this.api.deleteHelpinho(id).subscribe({
			next: () => {
				this.helpinhos = this.helpinhos.filter((h) => h.id !== id);
				this.toastService.add({ severity: "success", summary: "", detail: "Helpinho deletado com sucesso!" });
			},
			error: () => {
				this.toastService.add({ severity: "error", summary: "", detail: "Erro ao deletar helpinho!" });
			},
		});
	}
}
