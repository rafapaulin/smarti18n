import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { ObjMap } from '../../models';
import { LocaleLoaderInterface } from './locale-loader.interface';

@Injectable()
export class DefaultLoaderService implements LocaleLoaderInterface {
	/**
	 *Creates an instance of HttpLoaderService.
	 * @param {HttpClient} http
	 * @memberof HttpLoaderService
	 */
	constructor(private http: HttpClient) { }


	/**
	 * returns an observable for the loading of a locale
	 *
	 * @returns {Observable<ObjMap<string>>}
	 * @memberof HttpLoaderService
	 */
	public load(locale: string): Observable<ObjMap<string>> {
		return this.http.get<ObjMap<string>>(`/assets/i18n/${locale}.i18n.json`);
	}
}
