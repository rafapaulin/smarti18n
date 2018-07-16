export class StringUtils {
	/**
	 * Interpolate the variables passed on the string.
	 * @param {string} string String to be interpolated.
	 * @param {{}} variables Object containing the ```key:value``` pairs to be interpolated.
	 */
	public static interpolate(string: string, variables: any) {
		const stringVars = string.match(/:\w+[^\s:\.\,$\(\)\[\]\*]/g);

		if (!stringVars || stringVars.length <= 0)
			throw new Error('There is no parsable vars on the string. Please use the ":varName" notation.');

		for (const i in stringVars) {
			const key = stringVars[i].substring(1);

			if (variables.hasOwnProperty(key))
				string = string.replace(stringVars[i], variables[key]);
		}

		return string;
	}
}
