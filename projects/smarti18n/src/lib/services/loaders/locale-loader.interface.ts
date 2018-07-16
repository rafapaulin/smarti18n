import { Observable } from 'rxjs';
import { ObjMap } from '../../models';

export interface LocaleLoaderInterface {
	load(locale: string): Observable<ObjMap<string>>;
}
