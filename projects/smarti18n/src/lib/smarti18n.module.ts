import { NgModule } from '@angular/core';
import { Smarti18nDirective } from './directives/smarti18n.directive';
import { Smarti18nPipe } from './pipes/smarti18n.pipe';
import { Smarti18nService, ConfigService, LocaleLoaderService, DefaultLoaderService } from './services';

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
		ConfigService,
		{ provide: LocaleLoaderService, useClass: DefaultLoaderService },
		Smarti18nService
	]
})

export class Smarti18nModule { }
