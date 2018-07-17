import { ObjMap } from '../models';

export class ObjectUtils {
	/**
	 * deep merge two objects
	 *
	 * @static
	 * @template T
	 * @param {*} base
	 * @param {*} merge
	 * @returns {*}
	 * @memberof ObjectUtils
	 */
	public static deepMerge(base: any, merge: any): any {
		const isObj = val => val && typeof val === 'object';
		const result = { ...base, ...merge };
		Object.keys(merge).forEach(k => {
			if (isObj(merge[k]))
				result[k] = this.deepMerge(base[k], merge[k]);
			else result[k] = merge[k];
		});
		return result;
	}

	/**
	 * Tests if the entity provided is truthy.
	 * @param {*} value Entity to be tested.
	 */
	public static isTruthy(value: any) {
		return value !== null && value !== undefined;
	}
}
