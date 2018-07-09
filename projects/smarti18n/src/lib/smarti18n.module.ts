import { NgModule } from '@angular/core';
import { Smarti18nDirective } from './directives/smarti18n.directive';

@NgModule({
	declarations: [
		Smarti18nDirective
	],
	exports: [
		Smarti18nDirective
	]
})

export class Smarti18nModule { }
