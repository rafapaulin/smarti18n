import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocaleLoaderService } from './locale-loader.service';
import { ObjMap } from '../../models';

@Injectable()
export class DefaultLoaderService extends LocaleLoaderService {
	/**
	 *Creates an instance of HttpLoaderService.
	 * @param {HttpClient} http
	 * @memberof HttpLoaderService
	 */
	constructor(private http: HttpClient) {
		super();
	}


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
