import { ObjMap } from '../models';

export class ObjectUtils {
	/**
	 * deep merge two objects
	 *
	 * @static
	 * @template T
	 * @param {ObjMap<T>} base
	 * @param {ObjMap<T>} merge
	 * @returns {ObjMap<T>}
	 * @memberof ObjectUtils
	 */
	public static deepMerge<T>(base: ObjMap<T>, merge: ObjMap<T>): ObjMap<T> {
		const isObj = val => val && typeof val === 'object';
		const result = { ...base, ...merge };
		Object.keys(merge).forEach(k => {
			if (isObj(merge[k]))
				result[k] = this.deepMerge(base[k] as ObjMap<T>, merge[k] as ObjMap<T>);
			else result[k] = merge[k];
		});
		return result;
	}
}
