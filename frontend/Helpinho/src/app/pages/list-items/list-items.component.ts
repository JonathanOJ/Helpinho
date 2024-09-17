import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ApiService } from "../../api.service";
import { Subscription } from "rxjs";
import { UserModel } from "../model/user.model";
import { HelpinhoModel } from "../model/helpinho.model";
import { UserDonatedModel } from "../model/userDonated.model";
import { MessageService } from "primeng/api";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
	selector: "h-list-items",
	templateUrl: "./list-items.component.html",
	styles: [
		`
			::ng-deep .p-icon-field-left > .p-inputtext {
				width: 800px;
			}

			::ng-deep .p-dropdown {
				width: 250px;
			}

			::ng-deep .p-inputnumber {
				width: 100%;
			}

			@media screen and (max-width: 768px) {
				::ng-deep .p-icon-field-left > .p-inputtext {
					width: 80dvw;
				}

				::ng-deep .p-dropdown {
					width: 80dvw;
				}
			}
		`,
	],
	providers: [MessageService],
})
export class ListItemsComponent implements OnInit, OnDestroy {
	@Input() user: UserModel = new UserModel();
	@Output() donated: EventEmitter<any> = new EventEmitter();

	private api = inject(ApiService);
	private toastService = inject(MessageService);
	private breakpointObserver = inject(BreakpointObserver);

	searchItensSub: Subscription = new Subscription();
	donateSub: Subscription = new Subscription();

	showMoreHelpinhos: boolean = false;
	loading: boolean = false;
	modalHelpinho: boolean = false;
	modalDonate: boolean = false;
	categoriesFormatted: string = "";
	valueDonation: number = 0;
	selectedItem: HelpinhoModel = new HelpinhoModel();
	page: number = 1;
	timeout: any;
	searchResults: HelpinhoModel[] = [];
	isMobile: boolean = false;

	searchText: string = "";
	category: any = { name: "Todos" };

	categorys: any[] = [
		{ name: "Todos" },
		{ name: "Alimentação" },
		{ name: "Saúde" },
		{ name: "Vestuário" },
		{ name: "Educação" },
		{ name: "Moradia" },
		{ name: "Transporte" },
		{ name: "Trabalho" },
		{ name: "Dinheiro" },
		{ name: "Esporte" },
		{ name: "Justiça" },
		{ name: "Tecnologia" },
		{ name: "Outros" },
	];

	ngOnInit(): void {
		this.searchItens();
		this.handleWindowSize();
	}

	ngOnDestroy(): void {
		this.donateSub ? this.donateSub.unsubscribe() : null;
		this.searchItensSub ? this.searchItensSub.unsubscribe() : null;
	}

	handleWindowSize() {
		this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
			this.isMobile = result.matches;
		});
	}

	onScroll() {
		if (this.loading) return;
		this.page++;
		this.searchItens();
	}

	openModalHelpinho(helpinho: HelpinhoModel) {
		this.selectedItem = helpinho;
		this.categoriesFormatted = this.selectedItem.category.join(", ");
		this.modalHelpinho = true;
	}

	getValueFormatted(value: number): string {
		if (value === null || value === undefined || isNaN(value)) return "";

		let formattedValue = value.toFixed(2);

		formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

		formattedValue = formattedValue.replace(".", ",");

		return formattedValue;
	}

	handleFilter() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.page = 1;
			this.searchItens(true);
		}, 150);
	}

	searchItens(bySearch: boolean = false) {
		this.loading = true;

		const body = {
			search: this.searchText,
			category: this.category.name == "Todos" ? "" : this.category.name,
			page: this.page,
			itemsPerPage: 12,
		};

		this.showMoreHelpinhos = true;

		this.searchItensSub = this.api.searchHelpinho(body).subscribe({
			next: (response: any) => {
				if (response) {
					const items = response.Items;

					if (items.length > 0) {
						this.searchResults.length == 0 || bySearch
							? (this.searchResults = items)
							: this.searchResults.push(...items);
					} else {
						body.page == 1 ? (this.searchResults = []) : "";
					}
				}

				this.showMoreHelpinhos = false;
				this.loading = false;
			},
			error: () => {
				this.searchResults = [];
				this.showMoreHelpinhos = false;
				this.loading = false;
			},
		});
	}

	donate() {
		let user: UserDonatedModel = new UserDonatedModel();

		if (this.valueDonation <= 0) {
			this.toastService.add({ severity: "error", summary: "", detail: "Valor de doação inválido!" });
			return;
		}

		user.userId = this.user.userId;
		user.username = this.user.username;
		user.donated_value = this.valueDonation;
		user.image = this.user.image;
		user.helpinhoId = this.selectedItem.helpinhoId;

		this.loading = true;

		this.donateSub = this.api.donateHelpinho(user).subscribe({
			next: () => {
				this.modalDonate = false;
				this.loading = false;
				this.selectedItem.value_donated += this.valueDonation;
				this.searchItens(true);
				this.donated.emit();
				this.toastService.add({ severity: "success", summary: "", detail: "Doação realizada com sucesso!" });
			},
			error: () => {
				this.modalDonate = false;
				this.loading = false;
				this.toastService.add({ severity: "error", summary: "", detail: "Erro ao realizar doação!" });
			},
		});
	}
}
