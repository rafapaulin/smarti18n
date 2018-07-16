import { StringUtils } from './string-utils';

describe('StringUtils', () => {
	describe('interpolate()', () => {
		const vars = {
			iguanaName: 'Sauron',
			blackCatName: 'Lilith',
			whiteCatName: 'Isis'
		};

		const string = 'I have an iguana. Its name is :iguanaName. ' +
						'I also have two cats: a black one named :blackCatName, ' +
						'and a white one called :whiteCatName.';

		it('should interpolate provided variables into the string', () => {
			const result = StringUtils.interpolate(string, vars);
			expect(result).toBe('I have an iguana. Its name is Sauron. ' +
				'I also have two cats: a black one named Lilith, ' +
				'and a white one called Isis.');
		});
	});
});
