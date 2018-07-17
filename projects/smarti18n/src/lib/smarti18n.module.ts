import { NgModule, ModuleWithProviders } from '@angular/core';
import { Smarti18nDirective } from './directives/smarti18n.directive';
import { Smarti18nPipe } from './pipes/smarti18n.pipe';
import { LocaleLoaderService, DefaultLoaderService } from './services';

@NgModule({
	declarations: [
		Smarti18nDirective,
		Smarti18nPipe
	],
	exports: [
		Smarti18nDirective,
		Smarti18nPipe
	]
})

export class Smarti18nModule {
	public static defaultLoader(): ModuleWithProviders {
		return {
			ngModule: Smarti18nModule,
			providers: [
				{ provide: LocaleLoaderService, useClass: DefaultLoaderService }
			]
		};
	}
}
