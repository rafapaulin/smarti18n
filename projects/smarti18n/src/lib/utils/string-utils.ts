export class StringUtils {
	/**
	 * Interpolate the variables passed on the string.
	 * @param string String to be interpolated.
	 * @param variables Object containing the ```key:value``` pairs to be interpolated.
	 */
	public static interpolate(string: string, variables: any): string {
		if (!string) return '';

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


	/**
	 * Pluralize the provided sentence according to ```countVal```.
	 * @param string String to be pluralized
	 * @param countVal variable taken into account when pluralizing.
	 * @returns The pluralized string.
	 */
	public static pluralize(string: string, countVal: number): string {
		if (!string) return '';

		countVal = Number(countVal);

		const COMPLEX_COUNT_REGEX = /^(?:(?:{(\d+)})|(?:\[(\d+),(\d+|\*)\]))/;

		if (string.indexOf('|') === -1)
			throw new Error(`There is no plural options. Please use pipe "|" to separe the plural options. (string: ${string})`);

		const options = string.split('|');

		if (options.length < 3)
			throw new Error(`You need to provide at least 3 plural options on your string. (string: ${string})`);

		if (options.every(opt => COMPLEX_COUNT_REGEX.test(opt))) {
			for (const i in options) {
				const rangeData = options[i].match(COMPLEX_COUNT_REGEX);

				rangeData.shift();

				const range = rangeData
								.filter(val => !!val)
								.map(val => val === '*' ? Number.MAX_SAFE_INTEGER : Number(val));

				if (range[1] && range[0] >= range[1]) throw new Error(`Lower limit must be less than higher limit. (string: ${options[i]})`);

				if (
					(range.length === 1 && countVal === range[0]) ||
					(range.length === 2 && (countVal >= range[0] && countVal <= range[1]))
				)
					string = options[i].replace(COMPLEX_COUNT_REGEX, '');
			}
		} else if (options.some(opt => COMPLEX_COUNT_REGEX.test(opt)))
			throw new Error('Please provide the quantity notation ({total} or [min, max]) in all pluralization options.');
		else
			return countVal === 0 ? options[0] : (countVal === 1 ? options[1] : options[2]);

		return string;
	}
}
