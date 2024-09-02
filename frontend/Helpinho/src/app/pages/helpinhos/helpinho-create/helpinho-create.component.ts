import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../../../api.service";
import { MessageService } from "primeng/api";
import { HelpinhoModel } from "../../model/helpinho.model";
import { Subscription } from "rxjs";

@Component({
	selector: "h-helpinho-create",
	templateUrl: "./helpinho-create.component.html",
	styles: [],
	providers: [MessageService],
})
export class HelpinhoCreateComponent implements OnChanges, OnDestroy {
	@Input() helpinho: HelpinhoModel = new HelpinhoModel();
	@Output() onCancelEvent: EventEmitter<void> = new EventEmitter();
	@Output() onSaveEvent: EventEmitter<HelpinhoModel> = new EventEmitter();

	private api = inject(ApiService);
	private toastService = inject(MessageService);

	activeStep: number = 0;
	isInvalid: boolean = false;
	categoriesFormatted: string = "";

	onSaveSub: Subscription = new Subscription();
	updateUserHelpinhosCreatedSub: Subscription = new Subscription();

	categorys = [
		{ name: "Alimentação", value: "Alimentação", selected: false, icon: "food-apple-outline" },
		{ name: "Saúde", value: "Saúde", selected: false, icon: "stethoscope" },
		{ name: "Vestuário", value: "Vestuário", selected: false, icon: "tshirt-crew-outline" },
		{ name: "Educação", value: "Educação", selected: false, icon: "school-outline" },
		{ name: "Moradia", value: "Moradia", selected: false, icon: "home-outline" },
		{ name: "Transporte", value: "Transporte", selected: false, icon: "car-outline" },
		{ name: "Trabalho", value: "Trabalho", selected: false, icon: "briefcase-outline" },
		{ name: "Dinheiro", value: "Dinheiro", selected: false, icon: "cash-register" },
		{ name: "Esporte", value: "Esporte", selected: false, icon: "basketball" },
		{ name: "Justiça", value: "Justiça", selected: false, icon: "scale-balance" },
		{ name: "Tecnologia", value: "Tecnologia", selected: false, icon: "laptop" },
		{ name: "Outros", value: "Outros", selected: false, icon: "dots-horizontal-circle-outline" },
	];

	optionsValues = [
		{
			value: 100,
			icon: "rocket-launch-outline",
			selected: false,
		},
		{
			value: 1000,
			icon: "rocket-launch-outline",
			selected: false,
		},
		{
			value: 5000,
			icon: "rocket-launch-outline",
			selected: false,
		},
		{
			value: 10000,
			icon: "heart-outline",
			selected: false,
		},
		{
			value: 20000,
			icon: "heart-outline",
			selected: false,
		},
		{
			value: 50000,
			icon: "heart-outline",
			selected: false,
		},
	];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["helpinho"]) {
			this.categorys.map((c) => (c.selected = this.helpinho.category.includes(c.value)));
			this.categoriesFormatted = this.helpinho.category.join(", ");

			this.optionsValues.map((o) => (o.selected = o.value === this.helpinho.value));
		}
	}

	ngOnDestroy(): void {
		this.onSaveSub ? this.onSaveSub.unsubscribe() : "";
		this.updateUserHelpinhosCreatedSub ? this.updateUserHelpinhosCreatedSub.unsubscribe() : "";
	}

	onSave() {
		this.onSaveSub = this.api.saveHelpinho(this.helpinho).subscribe({
			next: (resp: any) => {
				this.updateUserHelpinhosCreatedSub = this.api
					.updateUserHelpinhosCreated(this.helpinho.user_responsable.id)
					.subscribe();
				let user = JSON.parse(sessionStorage.getItem("user") || "{}");

				user.total_helpinhos_created++;
				localStorage.setItem("user", JSON.stringify(user));
				this.onSaveEvent.emit(resp);
				this.helpinho = new HelpinhoModel();
				this.toastService.add({ severity: "success", summary: "", detail: "Helpinho salvo com sucesso!" });
			},
			error: () => {
				this.toastService.add({ severity: "error", summary: "", detail: "Erro ao salvar helpinho!" });
			},
		});
	}

	onUpload(event: any) {
		this.helpinho.image = event.files[0];
	}

	handleCategoriesSelected() {
		this.helpinho.category = this.categorys.filter((c) => c.selected).map((c) => c.value);
		this.categoriesFormatted = this.helpinho.category.join(", ");
	}

	handleValueSelected(option: any) {
		this.helpinho.value = option.value;
		this.optionsValues.map((o) => (o.selected = false));
		option.selected = true;
	}

	getValueFormatted(value: number): string {
		if (value === null || value === undefined || isNaN(value)) return "";

		let formattedValue = value.toFixed(2);

		formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

		formattedValue = formattedValue.replace(".", ",");

		return formattedValue;
	}
}
