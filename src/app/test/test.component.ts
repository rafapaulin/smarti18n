import { Component } from '@angular/core';

import { Smarti18nService } from 'projects/smarti18n/src/public_api';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.css']
})
export class TestComponent {
	public selectLocale = 'pt-br';
	public isTrue = false;
	public pipePath = 'pipe.works';

	constructor(private smarti18n: Smarti18nService) { }

	public changeLocale(): void {
		this.smarti18n.setLocale(this.selectLocale);
	}
}
