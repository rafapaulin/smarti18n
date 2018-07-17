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

	describe('pluralize()', () => {
		const subject1 = 'There is one orange.|There are many oranges.';
		const subject2 = '{0}There is no oranges.|{1}There is one orange.|[2,10]There are some oranges.|[11,*]There are many oranges.';

		it('should pluralize the provided simple sentences', () => {
			const result1 = StringUtils.pluralize(subject1, 1);
			const result2 = StringUtils.pluralize(subject1, 5);
			expect(result1).toBe('There is one orange.');
			expect(result2).toBe('There are many oranges.');
		});

		it('should pluralize the provided complex sentences', () => {
			const result1 = StringUtils.pluralize(subject2, 0);
			const result2 = StringUtils.pluralize(subject2, 1);
			const result3 = StringUtils.pluralize(subject2, 5);
			const result4 = StringUtils.pluralize(subject2, 20);
			expect(result1).toBe('There is no oranges.');
			expect(result2).toBe('There is one orange.');
			expect(result3).toBe('There are some oranges.');
			expect(result4).toBe('There are many oranges.');
		});
	});
});
