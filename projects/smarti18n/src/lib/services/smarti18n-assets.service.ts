import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	mergeMap,
	catchError
} from 'rxjs/operators';

@Injectable()

export class Smarti18nAssets {
	constructor(
		private http: HttpClient
	) {}

	public getString(componentName: string) {
		const locale = localStorage.getItem('smarti18n-locale');

		if (locale) {
			return this.http.get<any>(`/assets/i18n/${componentName}/${locale}.i18n.json`)
						.pipe(catchError(result => {
							console.log(result);
							return this.http.get(`/assets/i18n/${componentName}/default.i18n.json`);
						}));
		}

		return this.http.get(`/assets/i18n/${componentName}/default.i18n.json`);
	}
}
