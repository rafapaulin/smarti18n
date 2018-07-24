import { ObjMap } from './obj-map.model';

/**
 * @ignore
 */
export interface Smarti18nConfigModel {
	defaultLocale?: string;
	locale?: string;
	loader?: ObjMap<any>;
}
