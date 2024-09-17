import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
import { UserModel } from "../model/user.model";
import { ApiService } from "../../api.service";

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

			::ng-deep .p-tabview-title {
				font-weight: 400;
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
	@Input() userSession: UserModel = new UserModel();
	@Output() tabChangeEmit: EventEmitter<number> = new EventEmitter<number>();

	userId: string = sessionStorage.getItem("userId") || "";
	actualTheme: string = "light" || "dark";

	private auth = inject(AuthService);
	private router = inject(Router);
	private api = inject(ApiService);

	ngOnInit(): void {}

	signOut() {
		this.auth.signOut();
	}

	redirectToLogin(type: string) {
		this.router.navigate([`/${type}`]);
	}

	tabChange() {
		this.tabChangeEmit.emit(this.activeIndex);
	}
}
