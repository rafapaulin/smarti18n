import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ObjMap } from '../../models';
import { LocaleLoaderService } from './locale-loader.service';

@Injectable()
export class DefaultLocaleLoaderService extends LocaleLoaderService {
	/**
	 * Creates an instance of HttpLoaderService.
	 * @param http
	 * @memberof HttpLoaderService
	 */
	constructor(private http: HttpClient) { super(); }


	/**
	 * Returns an observable for the loading of a locale
	 * @param locale The desired locale.
	 * @returns The result of the ```.i18n.json``` file.
	 * @memberof HttpLoaderService
	 */
	public load(locale: string): Observable<ObjMap<string>> {
		return this.http.get<ObjMap<string>>(`/assets/i18n/${locale}/base.i18n.json`);
	}

	public lazyLoad(locale: string, fileName: string): Observable<ObjMap<string>> {
		return this.http.get<ObjMap<string>>(`/assets/i18n/${locale}/${fileName}.i18n.json`);
	}
}
