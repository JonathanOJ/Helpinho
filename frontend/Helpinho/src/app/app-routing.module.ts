import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { HelpinhosComponent } from "./pages/helpinhos/helpinhos.component";

const routes: Routes = [
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "home/pesquisa", component: HomeComponent },
	{ path: "home/sobre", component: HomeComponent },
	{ path: "login", component: LoginComponent },
	{ path: "register", component: LoginComponent },
	{ path: "helpinhos", component: HelpinhosComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
