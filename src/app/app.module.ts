import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Smarti18nModule } from 'projects/smarti18n/src/public_api';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';

@NgModule({
	declarations: [
		AppComponent,
		TestComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		Smarti18nModule.defaultLoader(),
		HttpClientModule
	],
	exports: [
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
