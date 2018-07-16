import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ObjMap } from '../../models';
import { LocaleLoaderInterface } from './locale-loader.interface';
import { DefaultLoaderService } from './default-locale-loader.service';

@Injectable()
export abstract class LocaleLoaderService implements LocaleLoaderInterface {
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
