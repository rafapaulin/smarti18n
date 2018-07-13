import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

import { Smarti18nConfigModel as Config } from '../models/smarti18n-config.model';

@Injectable()

export class Smarti18nService {
	private localization: any;
	private config: Config;
	private localeChanged = new Subject();
	public get onLocaleChanged(): any {
		return this.localeChanged.asObservable();
	}

	constructor(private http: HttpClient) {}

	public setConfig(configObject: Config) {
		this.config = {...this.config, ...configObject};

		this.getLocaleFiles();
	}

	public setLocale(locale: string) {
		this.config.locale = locale;

		this.getLocaleFiles();
	}

	public getConfig() {
		return this.config;
	}

	public getLocale() {
		return this.config.locale;
	}

	public getTranslation(jsonMap: string, variables?: any) {
		return this.getTranslatedString(jsonMap);
	}

	private getTranslatedString(jsonMap: string) {
		const jsomMapArray = jsonMap.split('.');
		const fnReduce = (a, b) => a ? a[b] : null;

		return	jsomMapArray.reduce(fnReduce, this.localization) || jsonMap;
	}

	private getLocaleFiles() {
		const requests = [];
		let theRequest;

		if (this.config.defaultLocale)
			requests.push(this.http.get(`/assets/i18n/${this.config.defaultLocale}.i18n.json`));

		if (this.config.locale)
			requests.push(this.http.get(`/assets/i18n/${this.config.locale}.i18n.json`));

		if (requests.length > 1)
			theRequest = forkJoin(requests).pipe(map(([defaultLocale, locale]) => ({...defaultLocale, ...locale})));
		else
			theRequest = requests[0];

		theRequest.toPromise().then(localization => {
			console.log('loaded');
			this.localization = localization;
			this.localeChanged.next();
		});
	}
}
