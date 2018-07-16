import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { forkJoin, Subject, Observable } from 'rxjs';

import { ConfigService } from './config/config.service';
import { Smarti18nConfigModel as Config, ObjMap } from '../models';
import { ObjectUtils, StringUtils } from '../utils';
import { LocaleLoaderService } from './loaders/locale-loader.service';

@Injectable({
	providedIn: 'root'
})
export class Smarti18nService {
	private localization: ObjMap<string>;
	private localeChanged = new Subject();
	public get onLocaleChanged(): Observable<any> {
		return this.localeChanged.asObservable();
	}
	public get config(): Config { return this.configService.config; }

	/**
	 *Creates an instance of Smarti18nService.
	 * @param {ConfigService} configService
	 * @param {LocaleLoaderService} loader
	 * @memberof Smarti18nService
	 */
	constructor(
		private configService: ConfigService,
		private loader: LocaleLoaderService
	) {
		this.configService
			.onConfigChanged
			.subscribe(
				configChange => this.loadLocaleFiles(configChange.config)
			);
	}

	/**
	 * Set a entirely new config object.
	 * @param {Config} configObject
	 * @memberof Smarti18nService
	 */
	public setConfig(configObject: Config) {
		this.configService.applyConfig(configObject);
	}

	/**
	 * Set a new locale to be used on translations.
	 * @param {string} locale
	 * @memberof Smarti18nService
	 */
	public setLocale(locale: string) {
		this.configService.applyConfig({ locale });
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
			return StringUtils.interpolate(rawTranslation, variables);

		return rawTranslation;
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
	private loadLocaleFiles(config: Config) {
		const requests = [config.defaultLocale, config.locale]
			.filter(locale => !!locale)
			.map(locale => this.loader.load(locale));
		const request = requests.length > 1
			? forkJoin(requests).pipe(map(([defaultLocale, locale]) => ObjectUtils.deepMerge(defaultLocale, locale)))
			: requests[0];
		// handle request
		if (request) {
			request.toPromise().then(localization => {
				this.localization = localization;
				this.localeChanged.next();
			});
		}
	}
}
