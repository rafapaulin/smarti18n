import { NgModule } from '@angular/core';
import { Smarti18nDirective } from './directives/smarti18n.directive';
import { Smarti18nService } from './services/smarti18n.service';
import { Smarti18nPipe } from './pipes/smarti18n.pipe';

@NgModule({
	declarations: [
		Smarti18nDirective,
		Smarti18nPipe
	],
	exports: [
		Smarti18nDirective,
		Smarti18nPipe
	],
	providers: [
		Smarti18nService
	]
})

export class Smarti18nModule { }
