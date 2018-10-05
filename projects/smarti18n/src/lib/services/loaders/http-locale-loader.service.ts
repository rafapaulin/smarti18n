import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ObjMap } from '../../models';
import { ConfigService } from '../config/config.service';
import { LocaleLoaderService } from './locale-loader.service';
import { consumeBinding } from '../../../../../../node_modules/@angular/core/src/render3/instructions';

@Injectable()
export class HttpLocaleLoaderService extends LocaleLoaderService {
	/**
	 * Creates an instance of HttpLoaderService.
	 * @param http
	 * @memberof HttpLoaderService
	 */
	constructor(
		private http: HttpClient,
		private configService: ConfigService
	) {
		super();
	}


	/**
	 * Returns an observable for the loading of a locale
	 * @param locale The desired locale.
	 * @returns The result of the ```.i18n.json``` file.
	 * @memberof HttpLoaderService
	 */
	public load(locale: string): Observable<ObjMap<string>> {
		if (!this.configService.config.loader)
			throw new Error('HttpLoaderService needs the property `loader` set in `setConfig()`');
		const config = this.configService.config.loader;
		return this.http.get<ObjMap<string>>(`${config.baseUrl ? config.baseUrl + '/' : ''}${locale}${config.suffix ? '/' + config.suffix : ''}`);
	}

	/**
	 * This method is useless (implemented just to meet the abstract)
	 * It should be refactored to http loader support lazyload
	 */
	public lazyLoad(locale: string): Observable<ObjMap<string>> {
		if (!this.configService.config.loader)
			throw new Error('HttpLoaderService needs the property `loader` set in `setConfig()`');
		const config = this.configService.config.loader;
		return this.http.get<ObjMap<string>>(`${config.baseUrl ? config.baseUrl + '/' : ''}${locale}${config.suffix ? '/' + config.suffix : ''}`);
	}
}
