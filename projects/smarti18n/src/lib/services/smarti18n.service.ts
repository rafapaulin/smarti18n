import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

import { Smarti18nConfigModel as Config, ObjMap } from '../models';

@Injectable()
export class Smarti18nService {
	private localization: any;
	private config: Config = {};
	private localeChanged = new Subject();
	public get onLocaleChanged(): any {
		return this.localeChanged.asObservable();
	}

	/**
	 * Creates an instance of Smarti18nService.
	 * @param {HttpClient} http
	 * @param {InterpolatorService} interpolatorService
	 * @memberof Smarti18nService
	 */
	constructor(private http: HttpClient) {}

	/**
	 * Set a entirely new config object.
	 * @param {Config} configObject
	 * @memberof Smarti18nService
	 */
	public setConfig(configObject: Config) {
		this.config = {...this.config, ...configObject};
		this.getLocaleFiles();
	}

	/**
	 * Set a new locale to be used on translations.
	 * @param {string} locale
	 * @memberof Smarti18nService
	 */
	public setLocale(locale: string) {
		this.config.locale = locale;
		this.getLocaleFiles();
	}

	/**
	 * Get the complete config object
	 * @returns
	 * @memberof Smarti18nService
	 */
	public getConfig() {
		return this.config;
	}

	/**
	 * Get the current set locale.
	 * @returns
	 * @memberof Smarti18nService
	 */
	public getLocale() {
		return this.config.locale;
	}

	/**
	 * Get the translation of the provided string.
	 * @param {string} jsonMap
	 * @param {*} [variables]
	 * @returns
	 * @memberof Smarti18nService
	 */
	public getTranslation(jsonMap: string, variables?: any) {
		const rawTranslation = this.getTranslatedString(jsonMap);

		if (variables)
			return this.interpolate(rawTranslation, variables);

		return rawTranslation;
	}

	/**
	 * Interpolate the variables passed on the string.
	 * @param {string} string String to be interpolated.
	 * @param {{}} variables Object containing the ```key:value``` pairs to be interpolated.
	 */
	public interpolate(string: string, variables: any) {
		const stringVars = string.match(/:\w+[^\s:\.\,$\(\)\[\]\*]/g);

		for (const i in stringVars) {
			const key = stringVars[i].substring(1);

			if (variables.hasOwnProperty(key))
				string = string.replace(stringVars[i], variables[key]);
		}

		return string;
	}

	/**
	 * Reduces the ```localization``` object to retrieve the translated string.
	 * @private
	 * @param {string} jsonMap
	 * @returns
	 * @memberof Smarti18nService
	 */
	private getTranslatedString(jsonMap: string) {
		const jsomMapArray = jsonMap.split('.');
		const fnReduce = (a, b) => a ? a[b] : null;

		return	jsomMapArray.reduce(fnReduce, this.localization) || jsonMap;
	}

	/**
	 * Retrieve the localization files, merge them if needed and save the result on memory
	 * @private
	 * @memberof Smarti18nService
	 */
	private getLocaleFiles() {
		const requests = [];
		let theRequest;

		if (this.config.defaultLocale)
			requests.push(this.http.get(`/assets/i18n/${this.config.defaultLocale}.i18n.json`));

		if (this.config.locale)
			requests.push(this.http.get(`/assets/i18n/${this.config.locale}.i18n.json`));

		if (requests.length > 1)
			theRequest = forkJoin(requests).pipe(map(([defaultLocale, locale]) => this.deepMerge(defaultLocale, locale)));
		else
			theRequest = requests[0];

		theRequest.toPromise().then(localization => {
			this.localization = localization;
			this.localeChanged.next();
		});
	}

	/**
	 * Deep merge two objects avoiding ```key:vaue``` pair destruction.
	 * @private
	 * @param {{}} orig
	 * @param {{}} dest
	 * @returns {*}
	 * @memberof Smarti18nService
	 */
	private deepMerge(base: ObjMap<string>, merge: ObjMap<string>): ObjMap<string> {
		const isObj = val => val && typeof val === 'object';
		const result = { ...base, ...merge };
		Object.keys(merge).forEach(k => {
			if (isObj(merge[k]))
				result[k] = this.deepMerge(base[k] as ObjMap<string>, merge[k] as ObjMap<string>);
			else result[k] = merge[k];
		});
		return result;
	}
}
