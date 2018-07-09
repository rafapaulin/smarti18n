import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Smarti18nModule } from 'projects/smarti18n/src/public_api';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		Smarti18nModule
	],
	providers: [
	],
	exports: [
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
