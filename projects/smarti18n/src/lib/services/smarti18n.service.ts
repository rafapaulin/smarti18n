import { Injectable } from '@angular/core';
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
	private lazLoadChunks = [];
	private localeChanged = new Subject();
	public get onLocaleChanged(): Observable<any> {
		return this.localeChanged.asObservable();
	}
	public get config(): Config { return this.configService.config; }

	/**
	 *Creates an instance of Smarti18nService.
	 * @param configService
	 * @param loader
	 * @memberof Smarti18nService
	 */
	constructor(
		private configService: ConfigService,
		private loader: LocaleLoaderService
	) {
		this.configService
			.onConfigChanged
			.subscribe(
				configChange => {
					this.loadLocaleFiles(configChange.config);
					this.lazyloadChunk(configChange.config);
				}
			);
	}

	/**
	 * Set a entirely new config object.
	 * @param configObject
	 * @memberof Smarti18nService
	 */
	public setConfig(configObject: Config): void {
		this.configService.applyConfig(configObject);
	}

	/**
	 * Set a new locale to be used on translations.
	 * @param locale The new desired locale
	 * @memberof Smarti18nService
	 */
	public setLocale(locale: string): void {
		this.configService.applyConfig({ locale });
	}

	/**
	 * Get the current set locale.
	 * @returns the currently configured locale
	 * @memberof Smarti18nService
	 */
	public getLocale(): string {
		return this.config.locale;
	}

	/**
	 * Get the translation of the provided string.
	 * @param jsonMap The map to the translation object key.
	 * @param variables Variables to be interpolated
	 * @param pluralize Numeric value used to parse the pluralization
	 * @returns The fully translated, counted and interpolated string
	 * @memberof Smarti18nService
	 */
	public getTranslation(jsonMap: string, variables?: any, pluralize?: number): string {
		if (this.localization) {
			let translation = this.getTranslatedString(jsonMap);

			if (ObjectUtils.isTruthy(pluralize))
				translation = StringUtils.pluralize(translation, pluralize);

			if (variables)
				translation = StringUtils.interpolate(translation, variables);

			return translation;
		}
	}

	/**
	 * Reduces the ```localization``` object to retrieve the translated string.
	 * @param jsonMap The map to the translation object key.
	 * @returns the raw translated string.
	 * @memberof Smarti18nService
	 */
	private getTranslatedString(jsonMap: string): string {
		const jsomMapArray = jsonMap.split('.');
		const fileName = jsonMap.split('.')[0];
		const fnReduce = (a, b) => a ? a[b] : null;
		const translation = jsomMapArray.reduce(fnReduce, this.localization);

		if (translation) return	translation;

		if (!this.lazLoadChunks.some(chunk => chunk === fileName)) {
			this.lazLoadChunks.push(fileName);

			this.lazyloadChunk();
		}
	}

	lazyloadChunk(config: Config = this.config): void {
		if (this.lazLoadChunks.length > 0) {
			for (const chunkName of this.lazLoadChunks) {
				const requests = [config.defaultLocale, config.locale]
					.filter(locale => !!locale)
					.map(locale => this.loader.lazyLoad(locale, chunkName));

				const request = requests.length > 1
					? forkJoin(requests).pipe(map(([defaultLocale, locale]) => ObjectUtils.deepMerge(defaultLocale, locale)))
					: requests[0];

				if (request) {
					request.toPromise()
					.catch(error => console.error(error.message))
					.then(chunk => {
						this.localization[chunkName] = chunk;
						this.localeChanged.next();
					});
				}
			}
		}
	}


	/**
	 * Retrieve the localization files, merge them if needed and save the result on memory
	 * @param config The ```smarti18n``` config object
	 * @memberof Smarti18nService
	 */
	private loadLocaleFiles(config: Config): void {
		const requests = [config.defaultLocale, config.locale]
			.filter(locale => !!locale)
			.map(locale => this.loader.load(locale));
		const request = requests.length > 1 ?
			forkJoin(requests).pipe(map(([defaultLocale, locale]) => ObjectUtils.deepMerge(defaultLocale, locale))) :
			requests[0];
		// handle request
		if (request) {
			request.toPromise().then(localization => {
				this.localization = localization;
				this.localeChanged.next();
			});
		}
	}
}
