import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule, DomSanitizer } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { PasswordModule } from "primeng/password";
import { InputMaskModule } from "primeng/inputmask";
import { CalendarModule } from "primeng/calendar";
import { CarouselModule } from "primeng/carousel";
import { GalleriaModule } from "primeng/galleria";
import { TabViewModule } from "primeng/tabview";
import { HeaderComponent } from "./pages/header/header.component";
import { ListItemsComponent } from "./pages/list-items/list-items.component";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { DropdownModule } from "primeng/dropdown";
import { TagModule } from "primeng/tag";
import { FooterComponent } from "./pages/footer/footer.component";
import { DividerModule } from "primeng/divider";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { HelpinhosComponent } from "./pages/helpinhos/helpinhos.component";
import { TableModule } from "primeng/table";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { StepperModule } from "primeng/stepper";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ToggleButtonModule } from "primeng/togglebutton";
import { HelpinhoCreateComponent } from "./pages/helpinhos/helpinho-create/helpinho-create.component";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		HeaderComponent,
		ListItemsComponent,
		FooterComponent,
		HelpinhosComponent,
		HelpinhoCreateComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		MatIconModule,
		ReactiveFormsModule,
		HttpClientModule,
		ButtonModule,
		InputTextModule,
		CheckboxModule,
		PasswordModule,
		InputMaskModule,
		CalendarModule,
		CarouselModule,
		GalleriaModule,
		TabViewModule,
		InputIconModule,
		IconFieldModule,
		DropdownModule,
		TagModule,
		DividerModule,
		ProgressSpinnerModule,
		InfiniteScrollDirective,
		TableModule,
		ProgressBarModule,
		ToastModule,
		DialogModule,
		StepperModule,
		FileUploadModule,
		InputTextareaModule,
		ToggleButtonModule,
	],
	providers: [provideAnimationsAsync()],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
	constructor(private sanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {
		matIconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl("./assets/mdi.svg"));
	}
}
