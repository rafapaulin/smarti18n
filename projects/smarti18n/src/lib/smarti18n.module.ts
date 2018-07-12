import { NgModule } from '@angular/core';
import { Smarti18nDirective } from './directives/smarti18n.directive';
import { Smarti18nService } from './services/smarti18n.service';

@NgModule({
	declarations: [
		Smarti18nDirective
	],
	exports: [
		Smarti18nDirective
	],
	providers: [
		Smarti18nService
	]
})

export class Smarti18nModule { }
