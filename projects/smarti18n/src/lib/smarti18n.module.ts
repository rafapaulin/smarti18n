import { NgModule } from '@angular/core';
import { Smarti18nDirective } from './directives/smarti18n.directive';
import { Smarti18nAssets } from './services/smarti18n-assets.service';

@NgModule({
	declarations: [
		Smarti18nDirective
	],
	exports: [
		Smarti18nDirective
	],
	providers: [
		Smarti18nAssets
	]
})

export class Smarti18nModule { }
