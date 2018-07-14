import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Smarti18nModule } from 'projects/smarti18n/src/public_api';
import { TestComponent } from './test/test.component';

@NgModule({
	declarations: [
		AppComponent,
		TestComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		Smarti18nModule,
		HttpClientModule
	],
	providers: [
	],
	exports: [
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
