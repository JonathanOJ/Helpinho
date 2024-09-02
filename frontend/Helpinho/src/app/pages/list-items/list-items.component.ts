import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../../api.service";
import { Subscription } from "rxjs";
import { UserModel } from "../model/user.model";
import { HelpinhoModel } from "../model/helpinho.model";

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
})
export class ListItemsComponent implements OnInit, OnDestroy {
	private api = inject(ApiService);
	user: UserModel = new UserModel();

	searchItensSub: Subscription = new Subscription();

	showMoreHelpinhos: boolean = false;
	loading: boolean = false;
	page: number = 1;
	timeout: any;
	searchResults: HelpinhoModel[] = [];

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
	}

	ngOnDestroy(): void {
		this.searchItensSub ? this.searchItensSub.unsubscribe() : null;
	}

	onScroll() {
		if (this.loading) return;

		this.page++;
		this.showMoreHelpinhos = true;
		this.searchItens();
	}

	handleFilter() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.page = 1;
			this.searchItens(true);
		}, 250);
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
				if (response.length > 0) {
					this.searchResults.length == 0 || bySearch
						? (this.searchResults = response)
						: this.searchResults.push(...response);
				} else {
					body.page == 1 ? (this.searchResults = []) : "";
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
}
