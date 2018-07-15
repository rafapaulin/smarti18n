import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { ObjMap } from '../../models';

@Injectable()
export abstract class LocaleLoaderService {
	/**
	 * loads locale data
	 *
	 * @abstract
	 * @param {string} locale					locale to load
	 * @returns {Observable<ObjMap<string>>}
	 * @memberof LocaleLoaderService
	 */
	public abstract load(locale: string): Observable<ObjMap<string>>;
}
