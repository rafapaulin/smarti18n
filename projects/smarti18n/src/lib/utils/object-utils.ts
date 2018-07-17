import { ObjMap } from '../models';

export class ObjectUtils {
	/**
	 * Deep merge two objects
	 * @param base Object to be the merge "host"
	 * @param merge Object to be merged into "host"
	 * @returns merged Object
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
	 * @param value Entity to be tested.
	 */
	public static isTruthy(value: any): boolean {
		return value !== null && value !== undefined;
	}
}
