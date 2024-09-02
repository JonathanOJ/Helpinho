import { Component, inject, Input, OnInit } from "@angular/core";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
import { UserModel } from "../model/user.model";

@Component({
	selector: "h-header",
	templateUrl: "./header.component.html",
	styles: [
		`
			::ng-deep .p-tabview .p-tabview-nav {
				background-color: transparent !important;
			}
			::ng-deep .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
				background-color: transparent !important;
				color: #ec4899;
				border-color: #ec4899;
			}
			::ng-deep .p-tabview .p-tabview-nav li .p-tabview-nav-link {
				background-color: transparent !important;
				color: #888888;
				border-color: transparent;
				padding-bottom: 12px;
			}
			::ng-deep .p-tabview .p-tabview-panels {
				background-color: transparent !important;
			}

			::ng-deep .p-button.p-button-outlined {
				background-color: white !important;
			}

			::ng-deep .p-button.p-button-rounded {
				border-radius: 16px;
			}

			@media screen and (max-width: 768px) {
				::ng-deep .p-button {
					padding: 8px 14px !important;
				}

				::ng-deep .p-button-label {
					font-size: 12px;
					font-weight: 500;
				}
			}

			::ng-deep .p-button {
				padding: 8px 14px;
			}

			::ng-deep .p-button-label {
				font-size: 14px;
				font-weight: 500;
			}

			::ng-deep .p-button.p-button-icon-only {
				width: 40px;
				height: 40px;
			}
		`,
	],
})
export class HeaderComponent implements OnInit {
	@Input() activeIndex: number = 0;

	private auth = inject(AuthService);
	private router = inject(Router);

	userSession: UserModel = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user") || "") : null;

	ngOnInit(): void {}

	signOut() {
		this.auth.signOut();
	}

	redirectToLogin(type: string) {
		this.router.navigate([`/${type}`]);
	}

	tabChange() {
		switch (this.activeIndex) {
			case 0:
				this.router.navigate([`/home`]);
				break;
			case 1:
				this.router.navigate([`/home/pesquisa`]);
				break;
			case 2:
				this.router.navigate([`/home/sobre`]);
				break;
			case 3:
				this.router.navigate([`/helpinhos`]);
				break;
		}
	}
}
