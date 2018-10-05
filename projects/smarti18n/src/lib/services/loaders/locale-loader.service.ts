import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ObjMap } from '../../models';

@Injectable()
export abstract class LocaleLoaderService {
	/**
	 * Loads locale data
	 * @param locale Locale to load
	 * @returns
	 * @memberof LocaleLoaderService
	 */
	public abstract load(locale: string): Observable<ObjMap<string>>;
	public abstract lazyLoad(locale: string, fileName: string): Observable<ObjMap<string>>;
}
