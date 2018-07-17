import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ObjMap } from '../../models';
import { LocaleLoaderInterface } from './locale-loader.interface';

@Injectable()
export abstract class LocaleLoaderService implements LocaleLoaderInterface {
	/**
	 * Loads locale data
	 * @param locale Locale to load
	 * @returns
	 * @memberof LocaleLoaderService
	 */
	public abstract load(locale: string): Observable<ObjMap<string>>;
}
