import { Component } from '@angular/core';
import { Smarti18nService } from 'projects/smarti18n/src/public_api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	constructor(
		private smarti18nService: Smarti18nService
	) {
		this.smarti18nService.setConfig({
			defaultLocale: 'en-us',
			locale: 'pt-br'
		});
	}
}
